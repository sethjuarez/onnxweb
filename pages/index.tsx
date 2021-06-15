import Head from 'next/head'
import Image from 'next/image'
import Draw from '~/components/Draw'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>onnx.js digist sample</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
                <h1 className="fixed top-0 text-6xl font-bold">
                    Predicting{' '}
                    <span className="text-blue-600">
                        Digits!
                    </span>
                </h1>

                <div className="mt-3 text-2xl">
                    <Draw />
                </div>
            </main>

            <footer className="flex items-center justify-center w-full h-24 border-t">
                Sample
            </footer>
        </div>
    )
}