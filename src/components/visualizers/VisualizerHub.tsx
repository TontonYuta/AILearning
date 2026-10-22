import React from 'react';
import { Lesson1_1_Tokenizer, Lesson1_2_Sampling, Lesson1_3_LostInMiddle } from './Chapter1Visualizers';
import { Lesson2_1_DenseSparse, Lesson2_2_VectorMath, Lesson2_3_HNSW } from './Chapter2Visualizers';
import { Lesson3_1_ParentChild, Lesson3_2_RerankRRF, Lesson3_3_SelfRAG } from './Chapter3Visualizers';
import { Lesson4_1_ReAct, Lesson4_2_LangGraph, Lesson4_3_Breakpoint } from './Chapter4Visualizers';
import { Lesson5_1_Injection, Lesson5_2_CanaryTrap, Lesson5_3_PiiRedactor } from './Chapter5Visualizers';
import { Lesson6_1_ConstrainedDecoding, Lesson6_2_JsonHealer, Lesson6_3_FrugalGpt } from './Chapter6Visualizers';
import { Lesson7_1_SemanticCache, Lesson7_2_PagedAttention, Lesson7_3_PromptCache } from './Chapter7Visualizers';
import { Lesson8_1_LlmJudge, Lesson8_2_RagTriad, Lesson8_3_Tracing } from './Chapter8Visualizers';

interface VisualizerHubProps {
  lessonId: number;
}

export const VisualizerHub: React.FC<VisualizerHubProps> = ({ lessonId }) => {
  switch (lessonId) {
    // Chương 1
    case 1:
      return <Lesson1_1_Tokenizer />;
    case 2:
      return <Lesson1_2_Sampling />;
    case 3:
      return <Lesson1_3_LostInMiddle />;
    // Chương 2
    case 4:
      return <Lesson2_1_DenseSparse />;
    case 5:
      return <Lesson2_2_VectorMath />;
    case 6:
      return <Lesson2_3_HNSW />;
    // Chương 3
    case 7:
      return <Lesson3_1_ParentChild />;
    case 8:
      return <Lesson3_2_RerankRRF />;
    case 9:
      return <Lesson3_3_SelfRAG />;
    // Chương 4
    case 10:
      return <Lesson4_1_ReAct />;
    case 11:
      return <Lesson4_2_LangGraph />;
    case 12:
      return <Lesson4_3_Breakpoint />;
    // Chương 5
    case 13:
      return <Lesson5_1_Injection />;
    case 14:
      return <Lesson5_2_CanaryTrap />;
    case 15:
      return <Lesson5_3_PiiRedactor />;
    // Chương 6
    case 16:
      return <Lesson6_1_ConstrainedDecoding />;
    case 17:
      return <Lesson6_2_JsonHealer />;
    case 18:
      return <Lesson6_3_FrugalGpt />;
    // Chương 7
    case 19:
      return <Lesson7_1_SemanticCache />;
    case 20:
      return <Lesson7_2_PagedAttention />;
    case 21:
      return <Lesson7_3_PromptCache />;
    // Chương 8
    case 22:
      return <Lesson8_1_LlmJudge />;
    case 23:
      return <Lesson8_2_RagTriad />;
    case 24:
      return <Lesson8_3_Tracing />;
    default:
      return <Lesson1_1_Tokenizer />;
  }
};
