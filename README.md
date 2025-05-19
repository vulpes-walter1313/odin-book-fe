# Odook

This is my attempt to [The Odin Book Project](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book) from [TheOdinProject](https://www.theodinproject.com). For a live demo, you can [see it hosted here](https://odin-book-fe.vercel.app). The backend code for this project can be [found here](https://github.com/vulpes-walter1313/odin-book-be).

## Front End Technologies

This project uses the following libraries:

- React
- React Router (declarative mode)
- Vite
- Shadcnui
- react-hook-form
- react-dropzone
- Tailwindcss
- Zod
- Luxon
- Tanstack Query
- Typescript

## Features

Odook is a basic social media network that allows users to create an account, post an image with a caption, view their feed with posts from users they follow, explore all posts, comment on posts, find new users to follow, search for specific users, update their account, and delete their account.

### Infinite scroll

All posts feed, from `/feed` and `/explore`, and the posts comments have infinite scroll enabled. This is powered by [Tanstack query](https://tanstack.com/query/latest) and [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer#readme)

### Google Oauth login

You can signin with google and skip the signup.

## Custom Font Sizes

This project uses custom tailwind font sizes. These are in the `tailwind.config.js` file.

```text
fontSize: {
  deskh1: ["3.375rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh2: ["2.8125rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh3: ["2.3125rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh4: ["1.9375rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh5: ["1.625rem", { lineHeight: "110%", fontWeight: "700"}],
	deskh6: ["1.375rem", { lineHeight: "110%", fontWeight: "700"}],
	deskp: ["1.125rem", { lineHeight: "150%", fontWeight: "400"}],
	desksmp: ["0.9375rem", { lineHeight: "150%", fontWeight: "400"}],
	deskxsp: ["0.8125rem", { lineHeight: "150%", fontWeight: "400"}],
	mobh1: ["2.25rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh2: ["2rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh3: ["1.8125rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh4: ["1.625rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh5: ["1.4375rem", { lineHeight: "110%", fontWeight: "700"}],
	mobh6: ["1.25rem", { lineHeight: "110%", fontWeight: "700"}],
	mobp: ["1.125rem", { lineHeight: "150%", fontWeight: "400"}],
	mobsmp: ["1rem", { lineHeight: "150%", fontWeight: "400"}],
	mobxsp: ["0.875rem", { lineHeight: "150%", fontWeight: "400"}],
}
```
