import { create } from "zustand";

export const useContentStore = create((set) => {
	console.log("Zustand Store Initialized");  // Debug log
	return {
		contentType: "movie",
		setContentType: (type) => set({ contentType: type }),
	};
});
