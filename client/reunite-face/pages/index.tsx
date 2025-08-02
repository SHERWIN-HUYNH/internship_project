import { useState, useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/home")
      .then((res) => res.json())
      .then((data) => console.log(data));
  },[])
  return <h1>Hello</h1>;
}
