import app from "./src/app.js";

const PORT = process.env.PORT
function main(){
  app.listen(PORT, ()=>{
    console.log(`SERVER ON PORT: http://localhost:${PORT}`);
  })
}
main()