"use client";

import dynamic from "next/dynamic";

// WebGL only exists in the browser, so the 3D stage never renders on the server.
const Stage = dynamic(() => import("./scene/Stage"), { ssr: false });

export function StageLoader() {
  return <Stage />;
}
