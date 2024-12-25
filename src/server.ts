import Server from '@/app';

const PORT = process.env.PORT ?? 3000;

const server = new Server();

const host = server.app.listen(PORT, () => {
  console.log('Server is running at http://localhost:' + PORT);
});

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGNIN', () => {
  host.close(() => {
    console.log('Process terminated');
    process.kill(process.pid, 'SIGINT');
  });
});
