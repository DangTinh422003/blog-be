import app from '@/app';

const PORT = process.env.PORT ?? 3000;

const server = app.listen(PORT, () => {
  console.log('Server is running at http://localhost:' + PORT);
});

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGNIN', () => {
  server.close(() => {
    console.log('Process terminated');
    process.kill(process.pid, 'SIGINT');
  });
});
