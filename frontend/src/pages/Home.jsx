import React from "react";
import Spline from '@splinetool/react-spline';
import { Link } from "react-router";
import { LuCodesandbox } from "react-icons/lu";

export default function Home() {
    return(
        <> <div className="relative h-screen  w-full">
        <Spline
          className="absolute inset-0 z-0"
          scene="https://prod.spline.design/19O-VO-aduVtWZfR/scene.splinecode"
        />
        <h1 className="absolute text-white/90 font-cool font-extrabold text-header z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cool text-header text-white text-5xl">
          ZEPTAH
        </h1>
        <Link to="/chat" className="px-2 absolute  top-3/4 left-1/2 -translate-x-2/3 rounded-full  -translate-y-1/2  py-2 m-5 hover:bg-emerald-500 hover:text-white font-cool text-7xl text-emerald-500 bg-white"><LuCodesandbox />
        </Link>
      </div>
      </>
    );
}