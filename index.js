import app from "./src/app.js";

function main (){
  const PORT = process.env.PORT
  app.listen(PORT, ()=>{
    console.log('SERVER ON PORT: http://localhost:', PORT);
  })
}
main()