import React from 'react';
import ReactDOM from 'react-dom/client';


const root = ReactDOM.createRoot(document.getElementById("app"));
const innerSpan = React.createElement("span",null,"hello there")
const el = React.createElement("h1",null,innerSpan);

const myEl = <h1>hello amine</h1>;
console.log(el);

root.render(myEl);


// console.log(React.version);

// function App() {
//   const [count,setCount] = React.useState(0)
//   return (
//     React.createElement('div',{},[
//       React.createElement('button', {
//         onClick: () => setCount(count + 1)
//       },'Increment'),
//       React.createElement('h1',{}, count)
//     ])
//   )
// }

// ReactDOM.render(React.createElement(App),document.getElementById("app"))  