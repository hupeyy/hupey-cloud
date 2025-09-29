<script>


  async function connWebSocket() {
    console.log('Connecting to WebSocket...');
    const socket = new WebSocket('ws://localhost:8000/ws/metrics');
    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send('Hello Server!');
    };
    socket.onmessage = (event) => {
      const metrics = JSON.parse(event.data);
      console.log('Message from server ', metrics);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };
  }
  
</script>

<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
<button on:click={connWebSocket} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Connect WebSocket
</button>
