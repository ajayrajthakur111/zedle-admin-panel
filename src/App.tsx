import { BrowserRouter } from "react-router-dom";
import { IndexRoutes } from "./routes";



function App() {
  return (
    <BrowserRouter>
      <IndexRoutes />
    </BrowserRouter>
  );
}

export default App;


//  const App = () => {
//   return (
//     <div className=" w-100 h-100 ">fdsdApp</div>
//   )
// }
// export default App