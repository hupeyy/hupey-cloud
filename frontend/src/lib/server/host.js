import { readFile, statfs } from 'node:fs/promises';

// Host-wide metrics. /proc and /sys inside the container reflect the Pi itself;
// statfs('/') reports the root disk the container's overlay lives on.

async function cpuTimes() {
	const line = (await readFile('/proc/stat', 'utf8')).split('\n')[0];
	const nums = line.trim().split(/\s+/).slice(1).map(Number);
	const idle = nums[3] + (nums[4] ?? 0);
	return { idle, total: nums.reduce((a, b) => a + b, 0) };
}

async function cpuPercent(sampleMs = 500) {
	const a = await cpuTimes();
	await new Promise((r) => setTimeout(r, sampleMs));
	const b = await cpuTimes();
	const total = b.total - a.total;
	return total > 0 ? (1 - (b.idle - a.idle) / total) * 100 : 0;
}

async function memory() {
	const info = Object.fromEntries(
		(await readFile('/proc/meminfo', 'utf8'))
			.split('\n')
			.filter(Boolean)
			.map((l) => {
				const [k, v] = l.split(':');
				return [k, parseInt(v) * 1024];
			})
	);
	return { total: info.MemTotal, used: info.MemTotal - info.MemAvailable };
}

async function temperature() {
	try {
		return parseInt(await readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8')) / 1000;
	} catch {
		return null;
	}
}

export async function hostStats() {
	const [cpu, mem, temp, load, uptime, fs] = await Promise.all([
		cpuPercent(),
		memory(),
		temperature(),
		readFile('/proc/loadavg', 'utf8').then((s) => s.split(' ').slice(0, 3).map(Number)),
		readFile('/proc/uptime', 'utf8').then((s) => parseFloat(s)),
		statfs('/')
	]);
	return {
		cpu,
		temp,
		load,
		uptime,
		memory: mem,
		disk: { total: fs.blocks * fs.bsize, used: (fs.blocks - fs.bavail) * fs.bsize }
	};
}
