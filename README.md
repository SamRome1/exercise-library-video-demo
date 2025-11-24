## Project info

Exercise Library Video Demo

This repository provides a simple demo for uploading exercise videos and attaching structured metadata. It is intended as a foundation for building a full exercise library system for fitness apps, coaching platforms, or content management tools.

## Overview

The demo includes:

A file upload flow for exercise demonstration videos

Metadata definitions for machines, exercises, and muscle applications

A clean structure for storing exercise descriptions, primary muscles, secondary muscles, and usage notes

Example data to help extend the system into a full production library

This project can serve as a backend reference, a prototype for a coaching platform, or a template for organizing large volumes of exercise footage.

## Features
Video Upload

Supports uploading .mp4, .mov, or .webm files and storing them in a structured directory.

Exercise Metadata

Each exercise can include the following fields:

Machine or equipment used

Primary muscle group

Secondary muscle groups

Description and setup instructions

Coaching cues

Variations

Common mistakes

Machine Usage Reference

## File Structure
exercise-library-video-demo/
│
├── uploads/                # Uploaded exercise videos
├── data/                   # Exercise metadata (JSON, schema, examples)
├── src/
│   ├── upload.js           # Basic upload endpoint or script
│   ├── metadata.js         # Metadata definitions and helpers
│   └── components/
│       └── VideoDisplay/   # Demo UI for viewing exercises
│
└── README.md

## Usage

Upload a video file into the uploads/ directory or through the provided upload script.

Create or edit a metadata entry in the data/ folder matching the exercise.

Fork and run on your own server to preview video playback and metadata rendering.

## License

This project is provided for demonstration and educational purposes. Use and modify as needed for your application.
