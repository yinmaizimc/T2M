import { searchToMarkdownOutline } from './deepseek';

// 先将所有"│"替换为4个空格，再用空格缩进分层，兼容所有树形符号+空格混合
export function smartTextToMarkdown(text: string): string {
  console.log('输入文本:', text);
  
  // 如果本身就是markdown列表，直接返回
  if (/^\s*[-*+]\s+|^\s*\d+\.\s+/m.test(text)) {
    console.log('检测到markdown列表，直接返回');
    return text;
  }
  
  // 预处理：所有"│"替换为4个空格
  const preprocessed = text.replace(/│/g, '    ');
  
  const lines = preprocessed.split(/\r?\n/);
  console.log('分割后的行数:', lines.length);
  let result: string[] = [];
  
  for (let rawLine of lines) {
    let content = rawLine.trim();
    if (!content) continue;
    
    // 统计前缀空格数，每4个空格算一级
    const match = rawLine.match(/^(\s*)/);
    const spaceCount = match ? match[1].length : 0;
    const level = Math.floor(spaceCount / 4);
    
    // 去掉"├──/└──/|——"等符号
    content = content.replace(/^([├└]──|(\|[ \t]*[—\-＿_]+))\s*/, '');
    
    const markdownLine = `${"  ".repeat(level)}- ${content}`;
    console.log(`生成markdown行: '${markdownLine}'`);
    result.push(markdownLine);
  }
  
  // 如果没有生成任何结果，原样返回
  if (result.length === 0) {
    console.log('没有生成任何结果，原样返回');
    return text;
  }
  
  const finalResult = result.join("\n");
  console.log('最终结果:', finalResult);
  return finalResult;
}

// LLM辅助的树形文本解析
export async function smartTextToMarkdownWithLLM(text: string): Promise<string> {
  // 先尝试本地算法
  const localResult = smartTextToMarkdown(text);
  
  // 检查是否包含树形符号，如果有则使用LLM
  if (/[│├└]/g.test(text)) {
    try {
      const prompt = `请将以下树形结构的文本转换为标准的Markdown列表格式，保持原有的层级关系：

${text}

要求：
1. 将树形符号（│、├──、└──等）转换为标准的Markdown缩进
2. 保持原有的层级关系
3. 只输出转换后的Markdown，不要其他解释
4. 使用"- "作为列表标记
5. 每级缩进使用2个空格`;

      const llmResult = await searchToMarkdownOutline(prompt);
      
      // 如果LLM返回了有效结果，使用LLM结果
      if (llmResult && llmResult.trim() && !llmResult.includes('抱歉') && !llmResult.includes('无法')) {
        return llmResult;
      }
    } catch (error) {
      console.warn('LLM解析失败，使用本地算法:', error);
    }
  }
  
  return localResult;
} 