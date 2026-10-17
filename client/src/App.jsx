import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import Discussions from "./pages/Discussions";
import DiscussionDetail from "./pages/DiscussionDetail";
import About from "./pages/About";
import Join from "./pages/Join";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminArticleEditor from "./pages/admin/AdminArticleEditor";
import AdminTopics from "./pages/admin/AdminTopics";
import AdminTopicEditor from "./pages/admin/AdminTopicEditor";
import AdminDiscussions from "./pages/admin/AdminDiscussions";
import AdminDiscussionDetail from "./pages/admin/AdminDiscussionDetail";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminMessages from "./pages/admin/AdminMessages";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:slug" element={<TopicDetail />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/discussions/:id" element={<DiscussionDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/new" element={<AdminArticleEditor />} />
          <Route path="articles/:id/edit" element={<AdminArticleEditor />} />
          <Route path="topics" element={<AdminTopics />} />
          <Route path="topics/new" element={<AdminTopicEditor />} />
          <Route path="topics/:id/edit" element={<AdminTopicEditor />} />
          <Route path="discussions" element={<AdminDiscussions />} />
          <Route path="discussions/:id" element={<AdminDiscussionDetail />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
