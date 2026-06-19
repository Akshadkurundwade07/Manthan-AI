from typing import TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
import os

class EvaluationSchema(BaseModel):
    feedback: str = Field(description="Detailed feedback for the essay")
    score: int = Field(description="Score out of 10", ge=0, le=10)

class UPSCState(TypedDict):
    essay: str
    language_feedback: str
    language_score: Annotated[int, operator.add]
    analysis_feedback: str
    analysis_score: Annotated[int, operator.add]
    clarity_feedback: str
    clarity_score: Annotated[int, operator.add]
    overall_feedback: str
    overall_score: int

class EssayEvaluator:
    def __init__(self):
        # Initialize LLM with Groq API
        api_key = os.environ.get('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.llm = ChatOpenAI(
            model="llama-3.3-70b-versatile",
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
            temperature=0.7
        )
        
        self.structured_model = self.llm.with_structured_output(EvaluationSchema)
        
        # Build the graph
        self.graph = self._build_graph()
    
    def _build_graph(self):
        def evaluate_language(state: UPSCState):
            prompt = f"""Evaluate the language quality of the following essay. 
            Consider grammar, vocabulary, sentence structure, and overall writing style.
            Provide detailed feedback and a score out of 10.
            
            Essay:
            {state['essay']}"""
            
            evaluation = self.structured_model.invoke(prompt)
            return {
                "language_feedback": evaluation.feedback,
                "language_score": evaluation.score
            }
        
        def evaluate_analysis(state: UPSCState):
            prompt = f"""Evaluate the depth and quality of analysis in the following essay.
            Consider critical thinking, argumentation, use of examples, and logical coherence.
            Provide detailed feedback and a score out of 10.
            
            Essay:
            {state['essay']}"""
            
            evaluation = self.structured_model.invoke(prompt)
            return {
                "analysis_feedback": evaluation.feedback,
                "analysis_score": evaluation.score
            }
        
        def evaluate_clarity(state: UPSCState):
            prompt = f"""Evaluate the clarity and organization of the following essay.
            Consider structure, flow, paragraph transitions, and overall readability.
            Provide detailed feedback and a score out of 10.
            
            Essay:
            {state['essay']}"""
            
            evaluation = self.structured_model.invoke(prompt)
            return {
                "clarity_feedback": evaluation.feedback,
                "clarity_score": evaluation.score
            }
        
        def final_evaluation(state: UPSCState):
            overall_score = (
                state['language_score'] + 
                state['analysis_score'] + 
                state['clarity_score']
            ) // 3
            
            overall_feedback = f"""
## Overall Evaluation

**Overall Score: {overall_score}/10**

### Language Quality ({state['language_score']}/10)
{state['language_feedback']}

### Depth of Analysis ({state['analysis_score']}/10)
{state['analysis_feedback']}

### Clarity & Organization ({state['clarity_score']}/10)
{state['clarity_feedback']}

### Summary
Your essay demonstrates {"excellent" if overall_score >= 8 else "good" if overall_score >= 6 else "satisfactory" if overall_score >= 4 else "needs improvement"} writing skills. 
{"Keep up the great work!" if overall_score >= 8 else "Continue practicing to improve your scores." if overall_score >= 6 else "Focus on the areas mentioned above for significant improvement."}
"""
            
            return {
                "overall_feedback": overall_feedback,
                "overall_score": overall_score
            }
        
        # Create graph with latest langgraph syntax
        graph = StateGraph(UPSCState)
        
        # Add nodes
        graph.add_node("evaluate_language", evaluate_language)
        graph.add_node("evaluate_analysis", evaluate_analysis)
        graph.add_node("evaluate_clarity", evaluate_clarity)
        graph.add_node("final_evaluation", final_evaluation)
        
        # Add edges - Latest langgraph uses START and END constants
        graph.add_edge(START, "evaluate_language")
        graph.add_edge(START, "evaluate_analysis")
        graph.add_edge(START, "evaluate_clarity")
        
        graph.add_edge("evaluate_language", "final_evaluation")
        graph.add_edge("evaluate_analysis", "final_evaluation")
        graph.add_edge("evaluate_clarity", "final_evaluation")
        
        graph.add_edge("final_evaluation", END)
        
        return graph.compile()
    
    def evaluate(self, essay: str):
        """Evaluate an essay and return detailed feedback"""
        result = self.graph.invoke({
            "essay": essay,
            "language_score": 0,
            "analysis_score": 0,
            "clarity_score": 0
        })
        
        return {
            'language_feedback': result['language_feedback'],
            'language_score': result['language_score'],
            'analysis_feedback': result['analysis_feedback'],
            'analysis_score': result['analysis_score'],
            'clarity_feedback': result['clarity_feedback'],
            'clarity_score': result['clarity_score'],
            'overall_feedback': result['overall_feedback'],
            'overall_score': result['overall_score']
        }
