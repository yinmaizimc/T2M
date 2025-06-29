import React, { useState, useRef } from "react";
import { Box, Typography, Paper, Button, TextField, Menu, MenuItem, CircularProgress } from "@mui/material";
import MarkdownIt from "markdown-it";
import MindMapEditor from "./components/MindMapEditor";
import { smartTextToMarkdown, smartTextToMarkdownWithLLM } from "./utils/smartTextToMarkdown";
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const mdParser = new MarkdownIt();

// 银灰色极简樱桃轮廓Logo，线条更细腻
const CherryOutlineLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="18" cy="18" rx="16" ry="16" fill="#222" />
    {/* 樱桃左果实轮廓 */}
    <ellipse cx="13.5" cy="23" rx="4" ry="4" fill="none" stroke="#C0C0C0" strokeWidth="1" />
    {/* 樱桃右果实轮廓 */}
    <ellipse cx="22.5" cy="23" rx="4" ry="4" fill="none" stroke="#C0C0C0" strokeWidth="1" />
    {/* 樱桃梗轮廓 */}
    <path d="M13.5 19 Q14 15 18 13 Q22 15 22.5 19" stroke="#C0C0C0" strokeWidth="1" fill="none" />
    {/* 叶子轮廓 */}
    <ellipse cx="18" cy="12.5" rx="2.2" ry="1.1" fill="none" stroke="#C0C0C0" strokeWidth="1" />
  </svg>
);

export default function App() {
  const [input, setInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [mdEdit, setMdEdit] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const markdownRef = useRef<string>("");
  const mindMapEditorRef = useRef<any>(null);

  // 下载脑图菜单
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleDownload = (type: "svg" | "png" | "jpg" | "xmind") => {
    if (!mindMapEditorRef.current) return;
    if (type === "svg") mindMapEditorRef.current.downloadSvg();
    if (type === "png") mindMapEditorRef.current.downloadPng();
    if (type === "jpg") mindMapEditorRef.current.downloadJpg();
    if (type === "xmind") mindMapEditorRef.current.downloadXmind();
    handleMenuClose();
  };

  // 智能文本转Markdown
  const handleInputChange = (v: string) => {
    setInput(v);
    const md = smartTextToMarkdown(v);
    setMarkdown(md);
    setMdEdit(md);
    markdownRef.current = md;
  };

  // LLM智能解析
  const handleLLMParse = async () => {
    if (!input.trim()) return;
    
    setIsLLMLoading(true);
    try {
      const md = await smartTextToMarkdownWithLLM(input);
      setMarkdown(md);
      setMdEdit(md);
      markdownRef.current = md;
    } catch (error) {
      console.error('LLM解析失败:', error);
    } finally {
      setIsLLMLoading(false);
    }
  };

  // Markdown富文本编辑
  const handleMdEditChange = (v: string) => {
    setMdEdit(v);
    setMarkdown(v);
    markdownRef.current = v;
  };

  // 下载Markdown
  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownRef.current], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f7", position: "relative", px: 6 }}>
      {/* 顶部Logo和主标题、下载按钮分两侧对齐 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 6, pb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 2 }}><CherryOutlineLogo /></Box>
          <Typography variant="h4" fontWeight={700} letterSpacing={2} sx={{ color: "#222" }}>
            文本转思维导图
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleMenuClick}
            startIcon={<ImageIcon />}
            sx={{ bgcolor: "#fff", color: "#222", borderRadius: 2, boxShadow: 1, fontWeight: 500, px: 2, mr: 1, '&:hover': { bgcolor: '#f0f0f0' } }}
          >
            下载脑图
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleDownload("svg")}>SVG</MenuItem>
            <MenuItem onClick={() => handleDownload("png")}>PNG</MenuItem>
            <MenuItem onClick={() => handleDownload("jpg")}>JPG</MenuItem>
            <MenuItem onClick={() => handleDownload("xmind")}>XMind</MenuItem>
          </Menu>
          <Button onClick={handleDownloadMarkdown} startIcon={<DescriptionIcon />} sx={{ bgcolor: "#fff", color: "#222", borderRadius: 2, boxShadow: 1, fontWeight: 500, px: 2, '&:hover': { bgcolor: '#f0f0f0' } }}>
            下载文件
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="flex-start" gap={4} px={0} sx={{ maxWidth: 1600, mx: "auto" }}>
        {/* 左栏：文本输入 20% */}
        <Paper elevation={2} sx={{ flex: "0 0 20%", minWidth: 180, maxWidth: 320, p: 3, borderRadius: 4, bgcolor: "#fff", boxShadow: "0 2px 8px 0 #0001", minHeight: 540, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#222" }}>文本输入</Typography>
          <TextField
            label="输入结构化文本"
            multiline
            minRows={16}
            maxRows={16}
            fullWidth
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: 2, background: "#fff", fontSize: 16, fontFamily: 'Menlo, Monaco, Consolas, monospace', mb: 2 }}
            InputProps={{ style: { fontSize: 15, fontFamily: 'Menlo, Monaco, Consolas, monospace' } }}
          />
          <Button
            onClick={handleLLMParse}
            disabled={isLLMLoading || !input.trim()}
            startIcon={isLLMLoading ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
            sx={{ 
              bgcolor: "#1976d2", 
              color: "#fff", 
              borderRadius: 2, 
              fontWeight: 500, 
              px: 2, 
              '&:hover': { bgcolor: '#1565c0' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            {isLLMLoading ? 'AI解析中...' : 'AI智能解析'}
          </Button>
        </Paper>
        {/* 中栏：Markdown富文本预览+编辑 30% */}
        <Paper elevation={2} sx={{ flex: "0 0 30%", minWidth: 240, maxWidth: 480, p: 3, borderRadius: 4, bgcolor: "#fff", boxShadow: "0 2px 8px 0 #0001", minHeight: 540, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#222" }}>Markdown预览（可编辑）</Typography>
          {isEditing ? (
            <TextField
              multiline
              minRows={18}
              maxRows={18}
              fullWidth
              value={mdEdit}
              onChange={e => handleMdEditChange(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: 2, background: "#fff", fontSize: 16, fontFamily: 'Menlo, Monaco, Consolas, monospace' }}
              InputProps={{ style: { fontSize: 15, fontFamily: 'Menlo, Monaco, Consolas, monospace' } }}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <Box
              sx={{ width: "100%", height: 420, overflow: "auto", bgcolor: "#f5f5f7", borderRadius: 2, p: 2, fontSize: 16, color: '#333', boxShadow: '0 1px 2px #0001', cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
              dangerouslySetInnerHTML={{ __html: mdParser.render(mdEdit) }}
            />
          )}
          <Typography variant="caption" sx={{ mt: 1, color: '#888' }}>点击内容可编辑</Typography>
        </Paper>
        {/* 右栏：脑图预览 50% */}
        <Paper elevation={2} sx={{ flex: "0 0 50%", minWidth: 320, maxWidth: 800, p: 3, borderRadius: 4, bgcolor: "#fff", boxShadow: "0 2px 8px 0 #0001", minHeight: 540, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#222" }}>脑图预览（左侧Markdown修改后会同步至脑图）</Typography>
          <Box sx={{ width: "100%", height: 420, overflow: "auto", bgcolor: "#f5f5f7", borderRadius: 2, p: 1, boxShadow: '0 1px 2px #0001' }}>
            <MindMapEditor markdown={markdown} showDownloadBtn={false} ref={mindMapEditorRef} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
