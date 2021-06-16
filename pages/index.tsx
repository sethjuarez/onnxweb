import Head from "next/head";
import Draw from "~/components/Draw";
import React, { useState } from "react";
import { Tensor, InferenceSession } from "onnxjs";

export default function Home() {
  const [probs, setProbs] = useState<number[]>([]);
  const [pred, setPred] = useState<number>(-1);
  const [show, setShow] = useState<boolean>(false);

  const onTensorSet = async (t: Float32Array) => {
    (async () => {
      const session = new InferenceSession();
      await session.loadModel("./model.onnx");
      const output = await session.run([new Tensor(t, "float32", [1, 784])]);
      const probs: number[] = Array.from(output.values().next().value.data);
      const pred = probs.indexOf(Math.max(...probs));
      setProbs(probs);
      setPred(pred);
      setShow(true);
    })();
  };

  const onTensorClear = () => setShow(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>onnx.js digist sample</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
        <h1 className="fixed top-0 text-6xl font-bold">
          Predicting <span className="text-blue-600">Digits!</span>
        </h1>

        <div>
          <Draw onSet={onTensorSet} onClear={onTensorClear} />
        </div>
        {show && (
          <>
            <div className="text-6xl mt-7">
              You drew a <span className="text-red-700 text-7xl">{pred}</span>!
            </div>
            
            <div className="flex flex-wrap max-w-2xl content-evenly mt-11">
              {probs.map((p, i) => (
                <div key={"probs_" + i} className="p-3 m-3 text-lg border border-gray-800 rounded-md w-36 h-14">
                  <span className="font-bold text-left text-red-700">{i}</span>:
                  <span className="ml-2 text-right">
                    {(p < .001 ? 0 : p * 100).toPrecision(3)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Created by&nbsp;<a href="https://twitter.com/sethjuarez">Seth Juarez</a>
      </footer>
    </div>
  );
}
