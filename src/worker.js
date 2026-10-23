export default {
  async fetch(request, env, ctx) {
    // Yahan tumhara koi bhi logic ho sakta hai, ya bas assets serve karo
    return env.ASSETS.fetch(request);
  },
};
