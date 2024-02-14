#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import os
import traceback

from openai import OpenAI

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def compare_text(text1: str, text2: str) -> float:
    '''
    利用openai的gpt3模型，比较两段文本的相关性
    :param text1: 文本1
    :param text2: 文本2
    :return: 相关性分数
    '''
    relevance_score = 70.0 # 默认值，确保主程序不会因为 ChatGPT 调用失败，而导致最终的权重得分大幅下降。
    prompt = f'''
        请比较【文本1】和【文本2】所讨论主题的相关性：0.0 表示完全不相关，10.0 表示完全相关。
        比较结果保留1位小数，完成后，请直接输出数字结果，如：7.5，5.0，0.0 等，注意不要输出多余的字符。
        下面是两段文本，请比较它们的相关性：

        【文本1】
        {text1}

        【文本2】
        {text2}
    '''

    try:
        response = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {
                    'role': 'system',
                    'content': prompt
                }
            ],
            temperature=0.7,
            max_tokens=100,
            top_p=0,
            n=1,
            frequency_penalty=0,
            presence_penalty=0,
            stream=False,
            stop=None
        )
        relevance_score = response.choices[0].message.content
        relevance_score = float(relevance_score) * 10
    except Exception as e:
        traceback.print_exc()

    return relevance_score


if __name__ == '__main__':
    text1 = '''
        金钱心理学：财富、人性和幸福的永恒真相
        人们总把投资理财当作一门硬科学，却忽略了心理因素在其中的重要作用。实际上，理财行为并非仅依靠冷冰冰的数字和公式，很多时候会受到你的情绪、喜好、立场和很多意料外的因素影响。因此，
        致富和守富的关键并不在于懂得多少知识，总结了多少规律，而常常在于如何克服人性的弱，认清事物运作的本质。 摩根·豪泽尔从心理角度手，在本书中分享了18条一针见血的理财智慧。如果你是理财新手，
        你会受一堂朴素、简明却能令你受用终生的理财课，先人一步实现财务自由。如果你是投资老手，本书也会帮你查缺补漏，返璞归真，守护好来之不易的财富。在风云变幻的投资理财领域，有些道理亘古不变，
        无论何时都能帮你实现财富的稳定增长。只有发现它们，把握它们，你才能在起伏不定的经济形势下实现长久的富足与幸福。
    '''
    text2 = '''
        金钱心理学：财富、人性和幸福的永恒真相丨大道至简的幸福理财指南，更适合普通人的《穷查理宝典》《纳瓦尔宝典》
        揭示关于财富积累的反直觉原理：财富≠花不完的钱，而是时间自由
        你和金钱的关系，决定了财富和你的距离！更适合普通上班族的《纳瓦尔宝典» .人们总把投资理财当作一门硬科学，却忽路了心理因素在其中的重要作用。实际上，理财行为并非仅依靠冷冰冰的数字和公式，
        很多时候会受到你的情绪、喜好、立场和很多意料外的因素...
    '''
    relevance_score = compare_text(text1, text2)
    print('relevance_score:', relevance_score)
