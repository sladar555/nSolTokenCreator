//window.global ||= window;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const timezone = 'America/New_York';
Intl.DateTimeFormat().resolvedOptions().timeZone = timezone;

import process from "process";
import { Buffer } from "buffer";

// @ts-ignore
window.Buffer = Buffer;
window.process = process;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <App />
  </>
)
