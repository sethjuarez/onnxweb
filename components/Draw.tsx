import React, { MouseEvent, useState, useRef } from "react";

export interface DrawProps {
  onSet: (t: Float32Array) => void;
  onClear: () => void;
}

type MouseState = {
  x: number;
  y: number;
  down?: boolean;
};

const Draw = ({ onSet, onClear }: DrawProps) => {
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0, down: false });
  const canvas = useRef<HTMLCanvasElement>(null);
  const miniCanvas = useRef<HTMLCanvasElement>(null);

  const getCurrentMousePos = (): MouseState => {
    const rect = canvas.current?.getBoundingClientRect();
    return {
      x: mouse.x - (rect?.left ?? 0),
      y: mouse.y - (rect?.top ?? 0),
    };
  };

  const handleMouseUp = () => setMouse({ x: mouse.x, y: mouse.y, down: false });

  const handleMouseDown = (e: MouseEvent) => {
    setMouse({ x: e.pageX, y: e.pageY, down: true });
    const ctx = canvas.current?.getContext("2d");
    const pos = getCurrentMousePos();
    ctx?.moveTo(pos.x, pos.y);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMouse({ x: e.pageX, y: e.pageY, down: mouse.down });
    if (mouse.down && canvas.current !== null) {
      const ctx = canvas.current.getContext("2d");
      if (ctx !== null) {
        const pos = getCurrentMousePos();
        ctx.lineTo(pos.x, pos.y);
        ctx.imageSmoothingEnabled = true;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 15;
        ctx.stroke();
      }
    }
  };

  const clearCanvas = (c: HTMLCanvasElement) => {
    const ctx = c.getContext("2d");
    if (ctx !== null) {
      ctx.beginPath();
      ctx.clearRect(-1, -1, c.width + 2, c.height + 2);
      ctx.closePath();
    }
  };

  const handleClear = () => {
    if (canvas.current !== null) clearCanvas(canvas.current);
    if (miniCanvas.current !== null) clearCanvas(miniCanvas.current);
    onClear();
  };

  const getDigit = (): Array<number> | null => {
    if (canvas.current !== null && miniCanvas.current !== null) {
      const c = canvas.current;
      const t = miniCanvas.current;
      var ctx = t?.getContext("2d");
      if (ctx !== null) {
        // clear previous image
        ctx.beginPath();
        ctx.clearRect(0, 0, t.width, t.height);
        ctx.closePath();

        // resize
        ctx.drawImage(c, 0, 0, t.width, t.height);

        // get image pixels
        var image = ctx.getImageData(0, 0, t.width, t.height);
        var data = image.data;
        // digit tensor
        var digit = [];

        for (var i = 0; i < data.length; i += 4) {
          // for some reason the alpha
          // channel holds the right data
          var v = data[i + 3];

          // add+normalize
          digit.push(v / 255);

          // we will redraw anyway as a
          // good sanity check
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        ctx.putImageData(image, 0, 0);

        return digit;
      }
    }
    return null;
  };

  const handleSet = () => {
    const d = getDigit();
    if (d !== null) {
      onSet(new Float32Array(d));
    }
  };

  return (
    <div id="draw">
      <canvas
        className="object-center border border-gray-600"
        ref={canvas}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        width="250px"
        height="250px"
      ></canvas>
      <canvas
        className="absolute bottom-2 right-2"
        ref={miniCanvas}
        width="28"
        height="28"
      ></canvas>
      <div className="mt-6">
        <button
          className="w-24 py-3 mr-4 text-2xl font-semibold text-white bg-blue-600 rounded-md focus:outline-none hover:ring-4"
          onClick={handleClear}
        >
          Clear
        </button>{" "}
        &nbsp;
        <button
          className="w-24 py-3 text-2xl font-semibold text-white bg-blue-600 rounded-md focus:outline-none hover:ring-4"
          onClick={handleSet}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default Draw;
