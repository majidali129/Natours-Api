import { app } from './app.js';

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('App is listening at port 8000');
});
