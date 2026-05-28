---
title: "从零实现 RAG 系统"
description: "手把手带你实现一个文档问答 RAG 系统：文档切分、向量检索、Prompt 组装、生成回答。"
date: 2026-05-15
tags: [rag, llm, embedding, 向量数据库, langchain]
topic: llm
---

RAG（Retrieval-Augmented Generation）是目前 LLM 应用最主流的范式。本文从零实现一个文档问答系统，帮助你理解 RAG 的核心原理。

## RAG 工作流

```
用户提问 → 检索相关文档 → 拼入 Prompt → LLM 生成回答
```

## 第一步：文档加载与切分

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "，", " ", ""]
)
chunks = splitter.split_documents(docs)
```

关键考量：
- **chunk_size**：太小会丢失上下文，太大会稀释检索精度。中文建议 300-800
- **chunk_overlap**：保留 10%-15% 重叠，防止关键信息被切断
- **separators**：中文场景优先按段落、句号切分

## 第二步：向量化存储

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings)
```

## 第三步：检索

```python
# MMR 检索：兼顾相关性和多样性
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20}
)
docs = retriever.invoke("什么是 Spark Shuffle？")
```

## 第四步：组装 Prompt + 生成

```python
from langchain.prompts import ChatPromptTemplate

template = """根据以下上下文回答问题。如果上下文中没有相关信息，请说"我不确定"。

上下文：
{context}

问题：{question}
"""
```

## 进阶优化

- **HyDE**：先让 LLM 生成假设性答案，再用它做检索 — 提升语义匹配
- **Re-ranking**：初检后用 Cross-Encoder 重排序，取 Top-3 最相关
- **Self-query**：提取问题中的元数据过滤条件，缩小检索范围
- **多级索引**：摘要索引 → 文档级索引 → 段落级索引，增加检索粒度

RAG 的核心不是模型，而是**检索质量**和**文档切分策略**。好的检索能让小模型回答出大模型的效果。
