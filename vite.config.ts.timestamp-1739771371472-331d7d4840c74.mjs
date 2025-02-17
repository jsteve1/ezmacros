// vite.config.ts
import { defineConfig } from "file:///C:/Users/jakes/Desktop/ezmacros/node_modules/vite/dist/node/index.js";
import preact from "file:///C:/Users/jakes/Desktop/ezmacros/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import mkcert from "file:///C:/Users/jakes/Desktop/ezmacros/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var vite_config_default = defineConfig({
  plugins: [
    preact(),
    mkcert()
  ],
  base: process.env.DEPLOY === "gh-pages" ? "/ezmacros/" : "/",
  build: {
    outDir: "dist",
    sourcemap: true
  },
  server: {
    host: "0.0.0.0",
    // Listen on all addresses
    port: 5173
  },
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqYWtlc1xcXFxEZXNrdG9wXFxcXGV6bWFjcm9zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqYWtlc1xcXFxEZXNrdG9wXFxcXGV6bWFjcm9zXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9qYWtlcy9EZXNrdG9wL2V6bWFjcm9zL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHByZWFjdCBmcm9tICdAcHJlYWN0L3ByZXNldC12aXRlJ1xyXG5pbXBvcnQgbWtjZXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLW1rY2VydCdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHByZWFjdCgpLFxyXG4gICAgbWtjZXJ0KClcclxuICBdLFxyXG4gIGJhc2U6IHByb2Nlc3MuZW52LkRFUExPWSA9PT0gJ2doLXBhZ2VzJyA/ICcvZXptYWNyb3MvJyA6ICcvJyxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBzb3VyY2VtYXA6IHRydWVcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogJzAuMC4wLjAnLCAgLy8gTGlzdGVuIG9uIGFsbCBhZGRyZXNzZXNcclxuICAgIHBvcnQ6IDUxNzNcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdyZWFjdCc6ICdwcmVhY3QvY29tcGF0JyxcclxuICAgICAgJ3JlYWN0LWRvbSc6ICdwcmVhY3QvY29tcGF0J1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZXNidWlsZDoge1xyXG4gICAganN4RmFjdG9yeTogJ2gnLFxyXG4gICAganN4RnJhZ21lbnQ6ICdGcmFnbWVudCdcclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlSLFNBQVMsb0JBQW9CO0FBQ3RULE9BQU8sWUFBWTtBQUNuQixPQUFPLFlBQVk7QUFHbkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE1BQU0sUUFBUSxJQUFJLFdBQVcsYUFBYSxlQUFlO0FBQUEsRUFDekQsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxJQUNmO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
