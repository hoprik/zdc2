"use client";
import {useEffect, useState} from "react";

export async function* streamingFetch( input: RequestInfo | URL, init?: RequestInit ) {

  const response = await fetch( input, init)
  // @ts-ignore
  const reader  = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  for( ;; ) {
    const { done, value } = await reader.read()
    if( done ) break;

    try {
      yield decoder.decode(value)
    }
    catch( e:any ) {
      console.warn( e.message )
    }

  }
}

export default function RenderStreamData() {
  const [data, setData] = useState<any[]>([]);

  useEffect( () => {
    const asyncFetch = async () => {
      const it = streamingFetch( '/api/v1/chat/stream/connect')

      for await ( let value of it ) {
        try {
          setData( (prev) => [...prev, value]);
        }
        catch( e:any ) {
          console.warn( e.message )
        }
      }
    }

    asyncFetch()
  }, []);

  return (
      <div>
        {data.map((chunk, index) => (
            <p key={index}>{`Received chunk ${index} - ${chunk}`}</p>
        ))}
      </div>
  );
}