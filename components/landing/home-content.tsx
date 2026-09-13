"use client";
import { LandingHeader } from "./landing-header";
import { Hero } from "./hero";
import { LandingFooter } from "./footer";
import "./public-pages.css";
export default function HomeContent() {
  return <div className="public-home" id="top"><LandingHeader /><main id="main-content"><Hero /></main><LandingFooter /></div>;
}
