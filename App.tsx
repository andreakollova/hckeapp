
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Matches from './pages/Matches.tsx';
import News from './pages/News.tsx';
import ArticleDetail from './pages/ArticleDetail.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/news" element={<News />} />
          <Route path="/article" element={<ArticleDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
