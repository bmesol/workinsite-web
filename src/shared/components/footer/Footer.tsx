import React from 'react';
import '@/shared/components/footer/Footer.scss'

export const Footer = () => {
  return (
    <div>
        <div className="footer">
          <div className="footer-links">
            Design:{" "}
            <a
              href="https://www.bmesolutions.in/"
              target="_blank"
              rel="noreferrer"
            >
              BM e-Solutions
            </a>
            {" | "}
            <a
              href="https://www.bmesolutions.in/privacy/"
              target="_blank"
              rel="noreferrer"
            >
              Privacy & Terms
            </a>
          </div>
          <div>
            Copyright © 2025{" "}
            <a
              href="https://www.bmesolutions.in/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "yellow" }}
            >
              BM e-Solutions
            </a>
            {" | "}Erode | Chennai – Tamil Nadu
          </div>
        </div>
    </div>
  )
}
