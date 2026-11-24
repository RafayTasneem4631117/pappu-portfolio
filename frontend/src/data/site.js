// ============================================================
//  SITE CONTENT  — edit the text of the website here.
//  Asset paths start with "/" and point inside the /assets folder
//  (e.g. "/pappu/pappu-hi.png" = assets/pappu/pappu-hi.png).
// ============================================================

export const site = {
  name: 'Syed Abdul Rafay Tasneem',
  heroGreeting: 'Hi! I’m',
  email: 'abdulrafay20@gmail.com', // shown in the contact section (as in the design)

  about: {
    title: 'A little about me',
    // Text copied exactly from the design file.
    text:
      'I’m Syed Abdul Rafay Tasneem, just a guy from Karachi who is a little enthusiastic about graphic design. Been working as a designer since 2020, and have worked on alot of projects since then. Looking forward to being part of more down the road.',
    handwrittenHi: 'Hi!',
  },

  learning: {
    title: 'Things I’m learning',
    subtitle: 'A growing collection of tools I’m exploring.',
  },

  projectsTitle: 'Stuff I’ve made',

  video: {
    title: 'In motion',
    // >>> PUT YOUR OWN MP4 AT:  assets/video/promo.mp4  <<<
    // (or change the path below). No code changes needed.
    src: '/video/promo.mp4',
    poster: '', // optional, e.g. '/video/poster.jpg'
  },

  contact: {
    title: 'Got an idea? Let’s talk',
    text: 'Have a question, a project, or just want to say hi? I’d love to hear from you.',
  },

  // 3D avatar exported from Blender. See documentation/BLENDER_GUIDE.md
  avatar: {
    glb: '/avatar/avatar.glb', // assets/avatar/avatar.glb
  },
}
