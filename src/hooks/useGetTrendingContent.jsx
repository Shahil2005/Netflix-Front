import React, { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  
  const contentType = useContentStore((state) => state.contentType);

  useEffect(() => {
    if (!contentType) return; // Avoid making the API call if contentType is undefined

    const getTrendingContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/trending`);
        setTrendingContent(res.data.content);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };

    getTrendingContent();
  }, [contentType]);

  return { trendingContent };
};

export default useGetTrendingContent;
