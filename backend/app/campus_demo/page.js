// app/campus-demo/page.js
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CampusDemoIntro() {
  return (
    <div className="grid place-content-center min-h-screen text-center">
      <div className="mb-32 mt-40">
        {}
        <h1 className="text-[80px] md:text-[112px] font-thin tracking-[12px] md:tracking-[16px] -mb-6 md:-mb-10">
          CAMPUS DISPATCH
        </h1>
        <h2 className="text-slate-500 font-thin text-[32px] md:text-[48px]">
          Smarter response for campus requests
        </h2>

        {}
        <div className="mt-16 text-lg md:text-xl space-y-2">
          <p className="text-2xl font-bold">CampusDispatch Lite</p>
          <p className="mt-2">
            Built for non-emergency campus issues (maintenance, safety, events)
          </p>
          <p className="text-slate-500">
            Powered by a Python backend + PostgreSQL / PostGIS
          </p>
        </div>

        {}
        <div className="cursor-pointer">
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="mt-20 text-lg py-6 font-light"
            >
              Go to Dispatch Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <h3 className="text-slate-500 text-[16px] md:text-[18px] mt-24 md:mt-40">
        Made with ☕ by Parnia as a campus dispatch project
      </h3>
    </div>
  );
}
