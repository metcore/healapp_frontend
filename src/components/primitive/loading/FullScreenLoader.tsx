'use client'

import React from 'react'
import { Spinner } from 'react-bootstrap'

type FullscreenLoaderProps = {
  text?: string
}

export default function FullscreenLoader({ text = "Loading..." }: FullscreenLoaderProps) {
  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white bg-opacity-75"
      style={{ zIndex: 1050 }}
    >
      <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <p className="mt-3 text-secondary fw-semibold">{text}</p>}
    </div>
  )
}
