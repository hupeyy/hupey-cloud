<script>
	// Paints a vertical gradient as ordered (Bayer) dithering between a few flat
	// colours at a chunky pixel size, like the sky in an old game. Fills its parent;
	// the parent's own CSS background shows until this has drawn.
	let { stops, pixel = 5 } = $props(); // stops: [[position 0-1, '#rrggbb'], ...]

	let canvas = $state();

	// Standard 8x8 Bayer threshold matrix
	const BAYER = [
		[0, 32, 8, 40, 2, 34, 10, 42],
		[48, 16, 56, 24, 50, 18, 58, 26],
		[12, 44, 4, 36, 14, 46, 6, 38],
		[60, 28, 52, 20, 62, 30, 54, 22],
		[3, 35, 11, 43, 1, 33, 9, 41],
		[51, 19, 59, 27, 49, 17, 57, 25],
		[15, 47, 7, 39, 13, 45, 5, 37],
		[63, 31, 55, 23, 61, 29, 53, 21]
	];

	const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

	function draw() {
		const w = Math.max(1, Math.ceil(canvas.clientWidth / pixel));
		const h = Math.max(2, Math.ceil(canvas.clientHeight / pixel));
		canvas.width = w;
		canvas.height = h;

		const colors = stops.map(([, hex]) => rgb(hex));
		const ctx = canvas.getContext('2d');
		const img = ctx.createImageData(w, h);

		for (let y = 0; y < h; y++) {
			const pos = y / (h - 1);
			let i = 0;
			while (i < stops.length - 2 && pos > stops[i + 1][0]) i++;
			const t = (pos - stops[i][0]) / (stops[i + 1][0] - stops[i][0]);
			for (let x = 0; x < w; x++) {
				const threshold = (BAYER[y % 8][x % 8] + 0.5) / 64;
				const [r, g, b] = colors[t > threshold ? i + 1 : i];
				const p = (y * w + x) * 4;
				img.data[p] = r;
				img.data[p + 1] = g;
				img.data[p + 2] = b;
				img.data[p + 3] = 255;
			}
		}
		ctx.putImageData(img, 0, 0);
	}

	$effect(() => {
		draw();
		const observer = new ResizeObserver(draw);
		observer.observe(canvas);
		return () => observer.disconnect();
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		image-rendering: pixelated;
	}
</style>
