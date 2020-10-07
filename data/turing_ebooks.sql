--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Ubuntu 12.4-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.4 (Ubuntu 12.4-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ebooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ebooks (
    isbn character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    price numeric(8,2) NOT NULL,
    url character varying(255) NOT NULL,
    bookid character varying(255) NOT NULL,
    forsale smallint
);


ALTER TABLE public.ebooks OWNER TO postgres;

--
-- Data for Name: ebooks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ebooks (isbn, title, price, url, bookid, forsale) FROM stdin;
9787115545381	JavaScript高级程序设计（第4版）	69.00	https://www.ituring.com.cn/book/2472	2472	1
9787115539168	SQL必知必会（第5版）	28.50	https://www.ituring.com.cn/book/2649	2649	1
9787115546678	数据分析之图算法：基于Spark和Neo4j	39.50	https://www.ituring.com.cn/book/2694	2694	1
9787115543844	普林斯顿数学分析读本	34.50	https://www.ituring.com.cn/book/1945	1945	1
9787115517234	深入理解神经网络：从逻辑回归到CNN	44.50	https://www.ituring.com.cn/book/2714	2714	1
9787115542106	纠缠：量子力学趣史	49.50	https://www.ituring.com.cn/book/809	809	1
9787115544551	游戏设计入门：理解玩家思维	64.50	https://www.ituring.com.cn/book/2084	2084	1
9787115538437	纯数学教程（第9版）	27.25	https://www.ituring.com.cn/book/2728	2728	1
9787115534408	简单高效LaTeX	24.50	https://www.ituring.com.cn/book/2685	2685	1
9787115538369	下金蛋的数学问题	39.50	https://www.ituring.com.cn/book/2752	2752	1
9787115544575	CSS图鉴	29.50	https://www.ituring.com.cn/book/2764	2764	1
9787115526649	卓越产品管理：产品经理如何打造客户真正需要的产品	34.50	https://www.ituring.com.cn/book/2023	2023	1
9787115542090	深入浅出神经网络与深度学习	44.50	https://www.ituring.com.cn/book/2789	2789	1
9787115539663	红发克拉拉的数学奇想	34.50	https://www.ituring.com.cn/book/2640	2640	1
9787115542601	混沌工程实战：手把手教你实现系统稳定性	29.50	https://www.ituring.com.cn/book/2730	2730	1
9787115527585	MySQL基础教程	64.50	https://www.ituring.com.cn/book/2571	2571	1
9787115540843	Bulma必知必会	24.50	https://www.ituring.com.cn/book/2611	2611	1
9787115534118	史前人类生活大辟谣	39.50	https://www.ituring.com.cn/book/2629	2629	1
9787115540812	设计冲刺：5天实现产品创新	49.50	https://www.ituring.com.cn/book/1747	1747	1
9787115534019	SQL查询：从入门到实践（第４版）	37.25	https://www.ituring.com.cn/book/2628	2628	1
9787115539144	编程的原则：改善代码质量的101个方法	29.50	https://www.ituring.com.cn/book/1923	1923	1
9787115536211	白话机器学习的数学	29.50	https://www.ituring.com.cn/book/2636	2636	1
9787115539670	Python元学习：通用人工智能的实现	29.50	https://www.ituring.com.cn/book/2697	2697	1
9787115539922	JavaScript语法简明手册	39.50	https://www.ituring.com.cn/book/2745	2745	1
9787115410474	数学思维导论：学会像数学家一样思考	18.00	https://www.ituring.com.cn/book/1110	1110	1
9787115539656	监控的艺术：云原生时代的监控框架	49.50	https://www.ituring.com.cn/book/1955	1955	1
9787115539441	精通Spring：Java Web开发与Spring Boot高级功能	49.50	https://www.ituring.com.cn/book/2443	2443	1
9787115519962	详解深度学习：基于TensorFlow和Keras学习RNN	39.50	https://www.ituring.com.cn/book/2584	2584	1
9787115538321	Web性能实战	49.50	https://www.ituring.com.cn/book/2011	2011	1
9787115432834	魔力Haskell	39.50	https://www.ituring.com.cn/book/1882	1882	1
9787115452511	Go并发编程实战（第2版）	39.50	https://www.ituring.com.cn/book/1950	1950	1
9787115522658	如何开会不添堵：消除拖延、误解与对抗的沟通协作术	29.50	https://www.ituring.com.cn/book/2666	2666	1
9787115465375	Lua设计与实现	24.50	https://www.ituring.com.cn/book/2001	2001	1
9787115531919	玩不够的数学2：当数学遇上游戏	34.50	https://www.ituring.com.cn/book/2591	2591	1
9787115536716	Spring响应式编程	49.50	https://www.ituring.com.cn/book/2574	2574	1
9787115219572	C语言程序设计：现代方法（第2版）	44.50	https://www.ituring.com.cn/book/208	208	1
9787115534651	架构师应该知道的37件事	34.50	https://www.ituring.com.cn/book/2014	2014	1
9787115534637	摩登创客：与智能手机和平板电脑共舞	34.50	https://www.ituring.com.cn/book/2602	2602	1
9787115521347	机遇之门：以色列闪存盘之父的创业心路	29.50	https://www.ituring.com.cn/book/2682	2682	1
9787115534170	数据压缩入门	34.50	https://www.ituring.com.cn/book/1893	1893	1
9787115533760	深入解析CSS	69.50	https://www.ituring.com.cn/book/2583	2583	1
9787115533302	Java数据科学实战	29.50	https://www.ituring.com.cn/book/2082	2082	1
9787115533753	Spring微服务架构设计（第2版）	44.50	https://www.ituring.com.cn/book/2442	2442	1
9787115528025	Python数据挖掘入门与实践（第2版）	39.50	https://www.ituring.com.cn/book/2652	2652	1
9787115516824	硅谷之火：个人计算机的诞生与衰落（第3版）	49.50	https://www.ituring.com.cn/book/1510	1510	1
9787115529688	Python高级机器学习	29.50	https://www.ituring.com.cn/book/1941	1941	1
9787115531582	计算机视觉之深度学习：使用TensorFlow和Keras训练高级神经网络	29.50	https://www.ituring.com.cn/book/2396	2396	1
9787115529862	发布！设计与部署稳定的分布式系统（第2版）	44.50	https://www.ituring.com.cn/book/2622	2622	1
9787115523471	一个数学家的辩白（双语版）	22.50	https://www.ituring.com.cn/book/2729	2729	1
9787115526861	精通Python设计模式（第2版）	24.50	https://www.ituring.com.cn/book/2680	2680	1
9787115516312	设计的陷阱：用户体验设计案例透析	29.50	https://www.ituring.com.cn/book/2098	2098	1
9787115457363	大数据项目管理：从规划到实现	29.50	https://www.ituring.com.cn/book/2641	2641	1
9787115522337	商战数据挖掘：你需要了解的数据科学与分析思维	44.50	https://www.ituring.com.cn/book/1262	1262	1
9787115512567	DevOps入门与实践	34.50	https://www.ituring.com.cn/book/2407	2407	1
9787115518903	写给大家看的PPT设计书（第2版）	34.50	https://www.ituring.com.cn/book/1992	1992	1
9787115485441	生成对抗网络项目实战	34.50	https://www.ituring.com.cn/book/2681	2681	1
9787115524003	RxJava反应式编程	49.50	https://www.ituring.com.cn/book/1916	1916	1
9787115523860	cURL必知必会	29.50	https://www.ituring.com.cn/book/2461	2461	1
9787115521484	Java实战（第2版）	59.50	https://www.ituring.com.cn/book/2659	2659	1
9787115522511	怎样解题：数学竞赛攻关宝典（第3版）	44.50	https://www.ituring.com.cn/book/2605	2605	1
9787115522016	设计体系：数字产品设计的系统化方法	29.50	https://www.ituring.com.cn/book/2597	2597	1
9787115509338	数学女孩4：随机算法	34.50	https://www.ituring.com.cn/book/2617	2617	1
9787115509345	深度学习的数学	34.50	https://www.ituring.com.cn/book/2593	2593	1
9787115520173	Python函数式编程（第2版）	39.00	https://www.ituring.com.cn/book/2658	2658	1
9787115516763	凤凰项目：一个IT运维的传奇故事（修订版）	34.50	https://www.ituring.com.cn/book/2631	2631	1
9787115517197	程序员面试金典（第6版）	69.00	https://www.ituring.com.cn/book/1876	1876	1
9787115511638	最后的数学问题	29.50	https://www.ituring.com.cn/book/2105	2105	1
9787115517869	Java实践指南	24.00	https://www.ituring.com.cn/book/2438	2438	1
9787115516077	悠扬的素数：二百年数学绝唱黎曼假设	29.00	https://www.ituring.com.cn/book/1892	1892	1
9787115517241	Serverless架构应用开发：Python实现	29.00	https://www.ituring.com.cn/book/2648	2648	1
9787115517210	Python数据结构与算法分析（第2版）	39.00	https://www.ituring.com.cn/book/2482	2482	1
9787115516176	演进式架构	29.00	https://www.ituring.com.cn/book/2440	2440	1
9787115515636	Kotlin编程权威指南	49.00	https://www.ituring.com.cn/book/2610	2610	1
9787115516169	松本行弘：编程语言的设计与实现	44.00	https://www.ituring.com.cn/book/1949	1949	1
9787115515421	深度学习基础与实践	59.00	https://www.ituring.com.cn/book/2542	2542	1
9787115516305	SQLAlchemy：Python数据库实战（第2版）	29.00	https://www.ituring.com.cn/book/1986	1986	1
9787115512420	Bootstrap实战（第2版）	35.00	https://www.ituring.com.cn/book/1961	1961	1
9787115512413	Python数据科学与机器学习：从入门到实践	35.00	https://www.ituring.com.cn/book/2426	2426	1
9787115511546	深入理解Python特性	24.00	https://www.ituring.com.cn/book/2582	2582	1
9787115511904	精通Metasploit渗透测试（第3版）	39.99	https://www.ituring.com.cn/book/2657	2657	1
9787115511645	特征工程入门与实践	29.99	https://www.ituring.com.cn/book/2606	2606	1
9787115509130	运动基因：非凡竞技能力背后的科学	39.99	https://www.ituring.com.cn/book/1692	1692	1
9787115510174	学习JavaScript数据结构与算法（第3版）	34.99	https://www.ituring.com.cn/book/2653	2653	1
9787115510402	深入理解JavaScript特性	39.99	https://www.ituring.com.cn/book/2452	2452	1
9787115475251	一个64位操作系统的设计与实现	54.99	https://www.ituring.com.cn/book/2450	2450	1
9787115509376	OAuth 2实战	44.99	https://www.ituring.com.cn/book/2013	2013	1
9787115509680	精通特征工程	29.99	https://www.ituring.com.cn/book/2050	2050	1
9787115509260	Python网络爬虫权威指南（第2版）	20.00	https://www.ituring.com.cn/book/1980	1980	1
9787115509000	数据结构与算法图解	24.99	https://www.ituring.com.cn/book/2538	2538	1
9787115509017	React Native开发指南（第2版）	34.99	https://www.ituring.com.cn/book/2437	2437	1
9787115507631	Java少儿编程	19.99	https://www.ituring.com.cn/book/2594	2594	1
9787115495631	生命是什么	27.99	https://www.ituring.com.cn/book/2409	2409	1
9787115497567	卷积神经网络的Python实现	24.99	https://www.ituring.com.cn/book/2661	2661	1
9787115435040	Docker——容器与容器云（第2版）	44.99	https://www.ituring.com.cn/book/1899	1899	1
9787115506887	shell脚本实战（第2版）	39.99	https://www.ituring.com.cn/book/2485	2485	1
9787115507174	Python经典实例	69.99	https://www.ituring.com.cn/book/1938	1938	1
9787115506641	白话机器学习算法	24.99	https://www.ituring.com.cn/book/2618	2618	1
9787115499035	邀你共进量子早餐	24.99	https://www.ituring.com.cn/book/2459	2459	1
9787115397478	数学分析八讲（修订版）	14.99	https://www.ituring.com.cn/book/1622	1622	1
9787115495242	我的第一本算法书	34.99	https://www.ituring.com.cn/book/2464	2464	1
9787115500298	写给大家看的设计书：案例篇	44.99	https://www.ituring.com.cn/book/2403	2403	1
9787115500809	极简算法史：从数学到机器的故事	19.99	https://www.ituring.com.cn/book/2590	2590	1
9787115502001	PWA开发实战	39.99	https://www.ituring.com.cn/book/2040	2040	1
9787115501998	Vue.js项目实战	34.99	https://www.ituring.com.cn/book/2575	2575	1
9787115500458	JRockit权威指南：深入理解JVM	49.99	https://www.ituring.com.cn/book/2491	2491	1
9787115480941	深入理解TensorFlow：架构设计与实现原理	39.99	https://www.ituring.com.cn/book/2397	2397	1
9787115499196	计算机科学精粹	24.99	https://www.ituring.com.cn/book/2579	2579	1
9787115499660	PostgreSQL即学即用（第3版）	39.99	https://www.ituring.com.cn/book/2460	2460	1
9787115499127	Python科学计算最佳实践：SciPy指南	34.99	https://www.ituring.com.cn/book/2078	2078	1
9787115293800	算法（第4版）	49.99	https://www.ituring.com.cn/book/875	875	1
9787115497833	Spark机器学习（第2版）	49.99	https://www.ituring.com.cn/book/2041	2041	1
9787115496829	说服式设计七原则：用设计影响用户的选择	24.99	https://www.ituring.com.cn/book/1877	1877	1
9787115494849	他们以为自己很厉害：12个企业管理陷阱	34.99	https://www.ituring.com.cn/book/2051	2051	1
9787115308108	具体数学：计算机科学基础（第2版）	49.99	https://www.ituring.com.cn/book/932	932	1
9787115494016	Python社会媒体挖掘	34.99	https://www.ituring.com.cn/book/2005	2005	1
9787115493668	面向数据科学家的实用统计学	44.99	https://www.ituring.com.cn/book/2066	2066	1
9787115491664	精通Java并发编程（第2版）	44.99	https://www.ituring.com.cn/book/2018	2018	1
9787115338365	HTML5权威指南（迄今为止最全面详实的网页设计参考书）	59.99	https://www.ituring.com.cn/book/931	931	1
9787115320902	C#图解教程（第4版）	49.99	https://www.ituring.com.cn/book/1108	1108	1
9787115249999	JavaScript DOM编程艺术(第2版)	27.99	https://www.ituring.com.cn/book/42	42	1
9787115484338	游戏剧本怎么写	29.99	https://www.ituring.com.cn/book/2400	2400	1
9787115488794	Unity移动游戏开发	44.99	https://www.ituring.com.cn/book/2117	2117	1
9787115490636	基础设施即代码：云服务器管理	44.99	https://www.ituring.com.cn/book/1879	1879	1
9787115488787	Arduino+传感器：玩转电子制作	39.99	https://www.ituring.com.cn/book/1896	1896	1
9787115490063	Flink基础教程	19.99	https://www.ituring.com.cn/book/2036	2036	1
9787115489456	Flask Web开发：基于Python的Web应用开发实战（第2版）	34.99	https://www.ituring.com.cn/book/2463	2463	1
9787115488763	Python深度学习	59.99	https://www.ituring.com.cn/book/2599	2599	1
9787115488770	Python高性能（第2版）	29.99	https://www.ituring.com.cn/book/2006	2006	1
9787115487308	Node.js实战（第2版）	44.99	https://www.ituring.com.cn/book/1993	1993	1
9787115488756	React设计模式与最佳实践	29.99	https://www.ituring.com.cn/book/2007	2007	1
9787115488800	Java攻略：Java常见问题的简单解法	34.99	https://www.ituring.com.cn/book/2032	2032	1
9787115486394	R数据科学	69.99	https://www.ituring.com.cn/book/2113	2113	1
9787115485151	奢侈与数字：数字时代品牌生存之道	34.99	https://www.ituring.com.cn/book/2061	2061	1
9787115481337	写给大家看的设计书：实战篇	44.99	https://www.ituring.com.cn/book/2402	2402	1
9787115468949	陶哲轩教你学数学	19.99	https://www.ituring.com.cn/book/2049	2049	1
9787115480255	陶哲轩实分析（第3版）	49.99	https://www.ituring.com.cn/book/1822	1822	1
9787115483669	奔跑吧，程序员：从零开始打造产品、技术和团队	49.99	https://www.ituring.com.cn/book/1776	1776	1
9787115485182	别拿相关当因果！因果关系简易入门	34.99	https://www.ituring.com.cn/book/1780	1780	1
9787115485588	深度学习入门：基于Python的理论与实现	29.99	https://www.ituring.com.cn/book/1921	1921	1
9787115485571	Python测试驱动开发：使用Django、Selenium和JavaScript进行Web编程（第2版）	59.99	https://www.ituring.com.cn/book/2052	2052	1
9787115485557	JSON实战	44.99	https://www.ituring.com.cn/book/2093	2093	1
9787115486554	统计学大师之路：乔治&#183;博克斯回忆录	24.99	https://www.ituring.com.cn/book/1326	1326	1
9787115484208	SQL 经典实例	69.99	https://www.ituring.com.cn/book/1691	1691	1
9787115480750	前方的路	24.99	https://www.ituring.com.cn/book/2580	2580	1
9787115482495	未来世界的幸存者	19.99	https://www.ituring.com.cn/book/2581	2581	1
9787115483614	科学也反常：“科学咖啡馆”怪谈	29.99	https://www.ituring.com.cn/book/1982	1982	1
9787115485564	简约至上：交互式设计四策略（第2版）	24.99	https://www.ituring.com.cn/book/2563	2563	1
9787115482525	Spark高级数据分析（第2版）	34.99	https://www.ituring.com.cn/book/2039	2039	1
9787115480293	机器学习与优化	44.99	https://www.ituring.com.cn/book/1413	1413	1
9787115462688	跟阿铭学Linux（第3版）	34.99	https://www.ituring.com.cn/book/2399	2399	1
9787115482198	Java轻松学	29.99	https://www.ituring.com.cn/book/2483	2483	1
9787115482181	Hadoop深度学习	19.99	https://www.ituring.com.cn/book/1940	1940	1
9787115480224	用户体验设计：100堂入门课	29.99	https://www.ituring.com.cn/book/1794	1794	1
9787115471604	人工智能简史	24.99	https://www.ituring.com.cn/book/2411	2411	1
9787115264596	持续交付：发布可靠软件的系统方法	44.50	https://www.ituring.com.cn/book/758	758	1
9787115480859	高效算法：竞赛、应试与提高必修128例	27.50	https://www.ituring.com.cn/book/2012	2012	1
9787115480934	OpenCV计算机视觉编程攻略（第3版）	39.99	https://www.ituring.com.cn/book/1962	1962	1
9787115479303	去中心化应用：区块链技术概述	19.99	https://www.ituring.com.cn/book/2072	2072	1
9787115480217	游戏设计信条：从创意到制作的设计原则	24.99	https://www.ituring.com.cn/book/1856	1856	1
9787115479198	从无穷开始：科学的困惑与疆界	19.99	https://www.ituring.com.cn/book/2022	2022	1
9787115480170	DevOps实践指南	44.99	https://www.ituring.com.cn/book/1891	1891	1
9787115480262	Android安全攻防实践	29.99	https://www.ituring.com.cn/book/1936	1936	1
9787115479648	Hadoop数据分析	34.99	https://www.ituring.com.cn/book/1944	1944	1
9787115478375	代码之外的功夫：程序员精进之路	24.99	https://www.ituring.com.cn/book/1917	1917	1
9787115478771	TensorFlow深度学习	24.99	https://www.ituring.com.cn/book/2420	2420	1
9787115477156	JavaScript测试驱动开发	39.99	https://www.ituring.com.cn/book/1920	1920	1
9787115477385	Linux Shell脚本攻略（第3版）	44.99	https://www.ituring.com.cn/book/2439	2439	1
9787115477781	精通机器学习：基于R（第2版）	34.99	https://www.ituring.com.cn/book/1989	1989	1
9787115477798	Java虚拟机基础教程	34.99	https://www.ituring.com.cn/book/1990	1990	1
9787115469342	算法小时代：从数学到生活的历变	19.99	https://www.ituring.com.cn/book/1994	1994	1
9787115475312	UX设计师要懂工业设计	29.99	https://www.ituring.com.cn/book/1818	1818	1
9787115473769	Python编程导论（第2版）	34.99	https://www.ituring.com.cn/book/1966	1966	1
9787115475893	Python数据科学手册	54.99	https://www.ituring.com.cn/book/1937	1937	1
9787115475619	Python机器学习基础教程	39.99	https://www.ituring.com.cn/book/1915	1915	1
9787115469977	统计学七支柱	19.99	https://www.ituring.com.cn/book/1865	1865	1
9787115474889	Python基础教程（第3版）	49.99	https://www.ituring.com.cn/book/2118	2118	1
9787115475534	精益设计：设计团队如何改善用户体验（第2版）	24.99	https://www.ituring.com.cn/book/1939	1939	1
9787115471666	亲爱的界面：让用户乐于使用、爱不释手（第2版）	29.99	https://www.ituring.com.cn/book/1851	1851	1
9787115473899	HTTP/2基础教程	24.99	https://www.ituring.com.cn/book/2020	2020	1
9787115473271	Kafka权威指南	34.99	https://www.ituring.com.cn/book/2067	2067	1
9787115471659	你不知道的JavaScript（下卷）	39.99	https://www.ituring.com.cn/book/1666	1666	1
9787115471390	C++性能优化指南	44.99	https://www.ituring.com.cn/book/1868	1868	1
9787115469915	数学女孩3：哥德尔不完备定理	24.99	https://www.ituring.com.cn/book/1859	1859	1
9787115470522	SQL进阶教程	39.99	https://www.ituring.com.cn/book/1813	1813	1
9787115471055	Arduino技术指南	59.99	https://www.ituring.com.cn/book/1866	1866	1
9787115471079	设计师要懂沟通术	29.99	https://www.ituring.com.cn/book/1808	1808	1
9787115470607	Python数据科学入门	24.99	https://www.ituring.com.cn/book/1919	1919	1
9787115469786	CSS重构：样式表性能调优	19.99	https://www.ituring.com.cn/book/1943	1943	1
9787115448606	单核工作法图解：事多到事少，拖延变高效	19.50	https://www.ituring.com.cn/book/1925	1925	1
9787115467584	深入理解SVG	34.99	https://www.ituring.com.cn/book/1835	1835	1
9787115468680	同构JavaScript应用开发	24.99	https://www.ituring.com.cn/book/1913	1913	1
9787115465634	时间旅行简史	24.99	https://www.ituring.com.cn/book/2053	2053	1
9787115467768	修改软件的艺术：构建易维护代码的9条最佳实践	27.50	https://www.ituring.com.cn/book/1749	1749	1
9787115466167	Web开发权威指南	49.99	https://www.ituring.com.cn/book/2070	2070	1
9787115467713	Hadoop安全：大数据平台隐私保护	39.99	https://www.ituring.com.cn/book/1600	1600	1
9787115467140	React Native应用开发实例解析	22.50	https://www.ituring.com.cn/book/1954	1954	1
9787115458414	Head First JavaScript程序设计	64.99	https://www.ituring.com.cn/book/1556	1556	1
9787115466372	交互的未来：物联网时代设计原则	18.00	https://www.ituring.com.cn/book/1795	1795	1
9787115457424	用户思维+：好产品让用户为自己尖叫	34.99	https://www.ituring.com.cn/book/1598	1598	1
9787115462947	Ruby基础教程（第5版）	39.99	https://www.ituring.com.cn/book/1843	1843	1
9787115466808	Java机器学习	24.99	https://www.ituring.com.cn/book/1909	1909	1
9787115465481	数学也荒唐：20个脑洞大开的数学趣题	24.99	https://www.ituring.com.cn/book/2031	2031	1
9787115464415	R图形化数据分析	34.99	https://www.ituring.com.cn/book/1777	1777	1
9787115465276	Python机器学习经典实例	29.99	https://www.ituring.com.cn/book/1894	1894	1
9787115460110	用数据讲故事	24.99	https://www.ituring.com.cn/book/1763	1763	1
9787115465696	JavaScript编程精粹	19.99	https://www.ituring.com.cn/book/2069	2069	1
9787115465016	Java测试驱动开发	24.99	https://www.ituring.com.cn/book/1942	1942	1
9787115459237	程序员的算法趣题	27.50	https://www.ituring.com.cn/book/1814	1814	1
9787115463357	Python数据分析基础	34.99	https://www.ituring.com.cn/book/1912	1912	1
9787115463333	黑客攻防技术宝典：反病毒篇	39.99	https://www.ituring.com.cn/book/1748	1748	1
9787115457592	Android编程权威指南（第3版）	59.99	https://www.ituring.com.cn/book/1976	1976	1
9787115459190	Python数据处理	49.99	https://www.ituring.com.cn/book/1819	1819	1
9787115457462	Swift编程权威指南（第2版）	44.50	https://www.ituring.com.cn/book/2038	2038	1
9787115454089	Web安全开发指南	34.99	https://www.ituring.com.cn/book/1775	1775	1
9787115456694	大师谈游戏设计：创意与节奏	19.99	https://www.ituring.com.cn/book/1862	1862	1
9787115454539	数据分析实战	22.50	https://www.ituring.com.cn/book/1716	1716	1
9787115454676	Git团队协作	34.99	https://www.ituring.com.cn/book/1779	1779	1
9787115455024	SQL基础教程（第2版）	39.99	https://www.ituring.com.cn/book/1880	1880	1
9787115454157	流畅的Python	69.99	https://www.ituring.com.cn/book/1564	1564	1
9787115451583	Angular权威教程	54.50	https://www.ituring.com.cn/book/1874	1874	1
9787115452368	前端架构设计	24.99	https://www.ituring.com.cn/book/1946	1946	1
9787115451699	图解物联网	29.99	https://www.ituring.com.cn/book/1803	1803	1
9787115449573	Docker开发指南	39.99	https://www.ituring.com.cn/book/1793	1793	1
9787115451200	高性能iOS应用开发	44.99	https://www.ituring.com.cn/book/1924	1924	1
9787115450173	Meteor实战	34.99	https://www.ituring.com.cn/book/1837	1837	1
9787115450142	客户端存储技术	19.99	https://www.ituring.com.cn/book/1836	1836	1
9787115448347	追踪引力波：寻找时空的涟漪	29.99	https://www.ituring.com.cn/book/1928	1928	1
9787115447630	算法图解	24.99	https://www.ituring.com.cn/book/1864	1864	1
9787115447555	学习敏捷：构建高效团队	39.99	https://www.ituring.com.cn/book/1567	1567	1
9787115447739	React快速上手开发	24.99	https://www.ituring.com.cn/book/1887	1887	1
9787115447579	计算进化史：改变数学的命运	19.99	https://www.ituring.com.cn/book/1926	1926	1
9787115446800	挑战编程技能：57道程序员功力测试题	19.99	https://www.ituring.com.cn/book/1732	1732	1
9787115442420	图解性能优化	29.99	https://www.ituring.com.cn/book/1584	1584	1
9787115446565	Docker经典实例	34.99	https://www.ituring.com.cn/book/1789	1789	1
9787115442437	Hadoop应用架构	34.99	https://www.ituring.com.cn/book/1710	1710	1
9787115441669	菜鸟侦探挑战数据分析	21.00	https://www.ituring.com.cn/book/1809	1809	1
9787115446558	响应式Web设计：HTML5和CSS3实战（第2版）	24.99	https://www.ituring.com.cn/book/1817	1817	1
9787115441102	软件开发本质论：追求简约、体现价值、逐步构建	19.99	https://www.ituring.com.cn/book/1897	1897	1
9787115441249	网络是怎样连接的	24.99	https://www.ituring.com.cn/book/1758	1758	1
9787115440150	Java编程思维	29.99	https://www.ituring.com.cn/book/1867	1867	1
9787115438560	Python项目开发实战（第2版）	39.99	https://www.ituring.com.cn/book/1719	1719	1
9787115436863	爱上电子学：创客的趣味电子实验（第2版）	43.99	https://www.ituring.com.cn/book/1890	1890	1
9787115439789	第一行代码——Android（第2版）	39.99	https://www.ituring.com.cn/book/1841	1841	1
9787115438959	C++程序设计实践与技巧：测试驱动开发	29.99	https://www.ituring.com.cn/book/1303	1303	1
9787115438065	GitHub实践	34.99	https://www.ituring.com.cn/book/1820	1820	1
9787115437303	深入React技术栈	39.99	https://www.ituring.com.cn/book/1898	1898	1
9787115431776	通关！游戏设计之道（第2版）	49.99	https://www.ituring.com.cn/book/1429	1429	1
9787115436986	Python科学计算基础教程	24.99	https://www.ituring.com.cn/book/1778	1778	1
9787115435682	匠心体验：智能手机与平板电脑的用户体验设计	34.50	https://www.ituring.com.cn/book/1889	1889	1
9787115437754	决胜UX：互联网产品用户体验策略	29.99	https://www.ituring.com.cn/book/1686	1686	1
9787115435590	普林斯顿微积分读本（修订版）	49.99	https://www.ituring.com.cn/book/1623	1623	1
9787115435712	MySQL与MariaDB学习指南	39.99	https://www.ituring.com.cn/book/1186	1186	1
9787115435965	多设备体验设计：物联网时代产品开发模式	29.99	https://www.ituring.com.cn/book/1191	1191	1
9787115435705	高性能Android应用开发	29.99	https://www.ituring.com.cn/book/1750	1750	1
9787115433947	黑客攻防技术宝典：浏览器实战篇	54.99	https://www.ituring.com.cn/book/1379	1379	1
9787115435477	社会工程：防范钓鱼欺诈（卷3）	25.00	https://www.ituring.com.cn/book/1696	1696	1
9787115435095	C#经典实例（第4版）	64.50	https://www.ituring.com.cn/book/1746	1746	1
9787115434180	进化：从孤胆极客到高效团队	22.50	https://www.ituring.com.cn/book/1759	1759	1
9787115432728	HTTPS权威指南：在服务器和Web应用上部署SSL/TLS和PKI	49.99	https://www.ituring.com.cn/book/1734	1734	1
9787115434104	精益品牌塑造	34.99	https://www.ituring.com.cn/book/1574	1574	1
9787115434135	速度与激情：以网站性能提升用户体验	24.99	https://www.ituring.com.cn/book/1572	1572	1
9787115431165	你不知道的JavaScript（中卷）	39.99	https://www.ituring.com.cn/book/1563	1563	1
9787115433145	Spring Boot实战	29.99	https://www.ituring.com.cn/book/1884	1884	1
9787115427885	R包开发	24.99	https://www.ituring.com.cn/book/1688	1688	1
9787115427472	垃圾回收的算法与实现	49.99	https://www.ituring.com.cn/book/1460	1460	1
9787115429674	Linux命令行与shell脚本编程大全（第3版）	54.99	https://www.ituring.com.cn/book/1698	1698	1
9787115428028	Python编程：从入门到实践	44.50	https://www.ituring.com.cn/book/1861	1861	1
9787115427847	设计师要懂心理学2	27.99	https://www.ituring.com.cn/book/1751	1751	1
9787115423375	倒漏斗营销：从现有客户拓展新客户	25.00	https://www.ituring.com.cn/book/1306	1306	1
9787115427106	Python数据挖掘入门与实践	29.99	https://www.ituring.com.cn/book/1745	1745	1
9787115424716	R语言入门与实践	29.99	https://www.ituring.com.cn/book/1540	1540	1
9787115424211	走近2050：注意力、互联网与人工智能	29.99	https://www.ituring.com.cn/book/1839	1839	1
9787115422293	日本电子产业兴衰录	19.99	https://www.ituring.com.cn/book/1738	1738	1
9787115424228	Python性能分析与优化	22.50	https://www.ituring.com.cn/book/1744	1744	1
9787115423887	写给大家看的安卓应用开发书：App Inventor 2快速入门与实战	34.99	https://www.ituring.com.cn/book/1704	1704	1
9787115421548	电子工程师必读：元器件与技术	49.99	https://www.ituring.com.cn/book/1594	1594	1
9787115422187	自制编译器	49.99	https://www.ituring.com.cn/book/1308	1308	1
9787115421487	Cocos2d-JS游戏开发	34.99	https://www.ituring.com.cn/book/1783	1783	1
9787115420572	R语言实战（第2版）	49.99	https://www.ituring.com.cn/book/1699	1699	1
9787115422286	Spark最佳实践	24.99	https://www.ituring.com.cn/book/1782	1782	1
9787115422453	注意力：专注的科学与训练	24.50	https://www.ituring.com.cn/book/1834	1834	1
9787115422071	JSON必知必会	17.99	https://www.ituring.com.cn/book/1720	1720	1
9787115421333	HTML5与WebGL编程	39.99	https://www.ituring.com.cn/book/1503	1503	1
9787115420473	干净的数据：数据清洗入门与实践	24.99	https://www.ituring.com.cn/book/1702	1702	1
9787115416940	CSS揭秘	49.99	https://www.ituring.com.cn/book/1695	1695	1
9787115420268	微服务设计	29.99	https://www.ituring.com.cn/book/1573	1573	1
9787115416810	Scala程序设计（第2版）	59.99	https://www.ituring.com.cn/book/1593	1593	1
9787115417411	数据科学入门	34.99	https://www.ituring.com.cn/book/1687	1687	1
9787115413765	Java性能权威指南	39.99	https://www.ituring.com.cn/book/1445	1445	1
9787115410801	精益企业：高效能组织如何规模化创新（（精益系列丛书，《精益创业》作者埃里克&#183;莱斯主编））	29.99	https://www.ituring.com.cn/book/1544	1544	1
9787115411051	精通Hadoop	24.99	https://www.ituring.com.cn/book/1599	1599	1
9787115400826	特斯拉：电气时代的开创者	34.99	https://www.ituring.com.cn/book/1253	1253	1
9787115411914	React Native入门与实战	39.99	https://www.ituring.com.cn/book/1762	1762	1
9787115405074	概率导论（第2版&#183;修订版）	39.99	https://www.ituring.com.cn/book/1755	1755	1
9787115407047	一个定理的诞生：我与菲尔茨奖的一千个日夜	19.99	https://www.ituring.com.cn/book/1735	1735	1
9787115411112	数学女孩2：费马大定理	19.50	https://www.ituring.com.cn/book/1677	1677	1
9787115409300	以太网权威指南（第2版）	44.50	https://www.ituring.com.cn/book/1446	1446	1
9787115411709	自制搜索引擎	19.99	https://www.ituring.com.cn/book/1582	1582	1
9787115408914	网站创富：从搭建、管理到营利	12.00	https://www.ituring.com.cn/book/1754	1754	1
9787115405463	希格斯粒子是如何找到的：史上最大物理实验的内部故事	18.00	https://www.ituring.com.cn/book/1437	1437	1
9787115410351	数学女孩	19.50	https://www.ituring.com.cn/book/1675	1675	1
9787115409669	OpenStack部署实践（第2版）	34.99	https://www.ituring.com.cn/book/1756	1756	1
9787115408600	Android基础教程（第4版）	24.99	https://www.ituring.com.cn/book/1679	1679	1
9787115404404	写给大家看的设计书（第4版）（平装）	18.00	https://www.ituring.com.cn/book/1757	1757	1
9787115406095	Java技术手册（第6版）	39.99	https://www.ituring.com.cn/book/1554	1554	1
9787115407092	Python语言及其应用	39.99	https://www.ituring.com.cn/book/1560	1560	1
9787115402615	决策知识自动化：大数据时代的商业决策分析方法	18.00	https://www.ituring.com.cn/book/1717	1717	1
9787115404718	玩转无人机	29.50	https://www.ituring.com.cn/book/1728	1728	1
9787115406088	游戏设计的236个技巧：游戏机制、关卡设计和镜头窍门	44.99	https://www.ituring.com.cn/book/1672	1672	1
9787115406866	人人都是数据分析师：Tableau应用实战	29.99	https://www.ituring.com.cn/book/1736	1736	1
9787115405647	玩不够的数学：算术与几何的妙趣	24.99	https://www.ituring.com.cn/book/1731	1731	1
9787115405319	精益客户开发（精益系列丛书，《精益创业》作者埃里克&#183;莱斯主编）	29.99	https://www.ituring.com.cn/book/1521	1521	1
9787115403995	有趣的二进制：软件安全与逆向分析	19.99	https://www.ituring.com.cn/book/1500	1500	1
9787115403643	Unity 5.x游戏开发指南	34.99	https://www.ituring.com.cn/book/1712	1712	1
9787115403278	Python Web开发：测试驱动方法	49.99	https://www.ituring.com.cn/book/1486	1486	1
9787115402547	SVG精髓（第2版）	34.99	https://www.ituring.com.cn/book/1542	1542	1
9787115402103	JavaScript Web应用开发	29.99	https://www.ituring.com.cn/book/1636	1636	1
9787115403094	Spark快速大数据分析	29.99	https://www.ituring.com.cn/book/1558	1558	1
9787115404145	学习JavaScript数据结构与算法	19.99	https://www.ituring.com.cn/book/1613	1613	1
9787115398963	EECS应用概率论	34.99	https://www.ituring.com.cn/book/1365	1365	1
9787115401083	统计思维：程序员数学之概率统计（第2版）	24.99	https://www.ituring.com.cn/book/1555	1555	1
9787115400413	函数式编程思维	24.99	https://www.ituring.com.cn/book/1491	1491	1
9787115395924	Ext JS实战（第2版）	39.99	https://www.ituring.com.cn/book/1358	1358	1
9787115397911	OpenStack运维指南	34.99	https://www.ituring.com.cn/book/1482	1482	1
9787115399281	优秀的叛逆者：引领组织变革的力量	12.00	https://www.ituring.com.cn/book/1557	1557	1
9787115395948	Clojure经典实例	49.99	https://www.ituring.com.cn/book/1454	1454	1
9787115396181	机器学习实践：测试驱动的开发方法	24.99	https://www.ituring.com.cn/book/1546	1546	1
9787115397300	全端Web开发：使用JavaScript与Java	29.99	https://www.ituring.com.cn/book/1489	1489	1
9787115396631	MEAN Web开发	29.99	https://www.ituring.com.cn/book/1536	1536	1
9787115396624	科学的极致：漫谈人工智能	14.99	https://www.ituring.com.cn/book/1701	1701	1
9787115394927	精通Linux（第2版）	29.99	https://www.ituring.com.cn/book/1548	1548	1
9787115394095	GitHub入门与实践	19.99	https://www.ituring.com.cn/book/1581	1581	1
9787115395191	Docker开发实践	29.99	https://www.ituring.com.cn/book/1631	1631	1
9787115393180	度量：一首献给数学的情歌	18.00	https://www.ituring.com.cn/book/1383	1383	1
9787115391872	Swift与Cocoa框架开发	44.99	https://www.ituring.com.cn/book/1565	1565	1
9787115391308	项目百态：软件项目管理面面观（修订版）	24.99	https://www.ituring.com.cn/book/1669	1669	1
9787115392275	计算机是怎样跑起来的	19.99	https://www.ituring.com.cn/book/1139	1139	1
9787115391681	命令行中的数据科学	24.99	https://www.ituring.com.cn/book/1539	1539	1
9787115389732	学习响应式设计	34.99	https://www.ituring.com.cn/book/1188	1188	1
9787115388889	JavaScript设计模式与开发实践	29.99	https://www.ituring.com.cn/book/1632	1632	1
9787115388940	Scala与Clojure函数式编程模式：Java虚拟机高效编程	24.99	https://www.ituring.com.cn/book/1320	1320	1
9787115387769	iOS开发指南：从零基础到App Store上架（第3版）	39.99	https://www.ituring.com.cn/book/1629	1629	1
9787115385734	你不知道的JavaScript（上卷）	24.99	https://www.ituring.com.cn/book/1488	1488	1
9787115385130	程序是怎样跑起来的	19.99	https://www.ituring.com.cn/book/1136	1136	1
9787115385703	Android安全攻防权威指南	44.99	https://www.ituring.com.cn/book/1378	1378	1
9787115320506	HTML5秘籍（第2版）	44.50	https://www.ituring.com.cn/book/1361	1361	1
9787115384881	Java 8函数式编程	19.99	https://www.ituring.com.cn/book/1448	1448	1
9787115385376	算法的乐趣	39.99	https://www.ituring.com.cn/book/1605	1605	1
9787115385178	MariaDB原理与实现	24.99	https://www.ituring.com.cn/book/1630	1630	1
9787115386069	七周七并发模型	24.99	https://www.ituring.com.cn/book/1649	1649	1
9787115383907	产品经理面试宝典	29.99	https://www.ituring.com.cn/book/1332	1332	1
9787115383495	数据科学实战	39.99	https://www.ituring.com.cn/book/1193	1193	1
9787115380326	Elasticsearch服务器开发（第2版）	29.99	https://www.ituring.com.cn/book/1447	1447	1
9787115382924	Learning hard C#学习笔记	24.99	https://www.ituring.com.cn/book/1604	1604	1
9787115382467	社会工程 卷2：解读肢体语言	19.99	https://www.ituring.com.cn/book/1387	1387	1
9787115380456	发布！软件的设计与部署	24.99	https://www.ituring.com.cn/book/1606	1606	1
9787115380333	Node与Express开发	34.99	https://www.ituring.com.cn/book/1485	1485	1
9787115378040	系统化思维导论（25周年纪念版）	29.99	https://www.ituring.com.cn/book/1148	1148	1
9787115377906	移动应用UI设计模式（第2版）	34.99	https://www.ituring.com.cn/book/1453	1453	1
9787115376725	咨询的奥秘（续）：咨询师的百宝箱	14.99	https://www.ituring.com.cn/book/1149	1149	1
9787115377722	ASP.NET Web API设计	49.99	https://www.ituring.com.cn/book/1450	1450	1
9787115374769	精益数据分析（精益系列丛书，《精益创业》作者埃里克&#183;莱斯主编）	39.99	https://www.ituring.com.cn/book/1125	1125	1
9787115376091	JavaScript快速全栈开发	24.99	https://www.ituring.com.cn/book/1442	1442	1
9787115376411	物联网设计：从原型到产品	29.99	https://www.ituring.com.cn/book/1302	1302	1
9787115374271	C#并发编程经典实例	24.99	https://www.ituring.com.cn/book/1483	1483	1
9787115374233	证明达尔文：进化和生物创造性的一个数学理论	14.99	https://www.ituring.com.cn/book/1386	1386	1
9787115374387	我们要自学	12.00	https://www.ituring.com.cn/book/1534	1534	1
9787115375810	游戏开发的数学和物理	29.99	https://www.ituring.com.cn/book/1373	1373	1
9787115369475	代码本色：用编程模拟自然系统	49.99	https://www.ituring.com.cn/book/1292	1292	1
9787115371072	程序员必读之软件架构	24.99	https://www.ituring.com.cn/book/1444	1444	1
9787115372697	Python网络编程攻略	24.99	https://www.ituring.com.cn/book/1484	1484	1
9787115373335	Swift开发指南（修订版）	39.99	https://www.ituring.com.cn/book/1517	1517	1
9787115373984	Go并发编程实战	39.99	https://www.ituring.com.cn/book/1525	1525	1
9787115361547	计算的本质：深入剖析程序和计算机	39.99	https://www.ituring.com.cn/book/1098	1098	1
9787115367174	父与子的编程之旅：与小卡特一起学Python	39.99	https://www.ituring.com.cn/book/1353	1353	1
9787115370594	HTML5数据推送应用开发	24.99	https://www.ituring.com.cn/book/1443	1443	1
9787115371263	Storm源码分析	39.99	https://www.ituring.com.cn/book/1507	1507	1
9787115370419	Groovy程序设计	29.99	https://www.ituring.com.cn/book/1294	1294	1
9787115367167	程序员健康指南	18.00	https://www.ituring.com.cn/book/1295	1295	1
9787115363114	自然计算：DNA、量子比特和智能机器的未来	18.00	https://www.ituring.com.cn/book/1103	1103	1
9787115366511	Unity API解析	24.99	https://www.ituring.com.cn/book/1474	1474	1
9787115363398	数据结构与算法JavaScript描述	29.99	https://www.ituring.com.cn/book/1440	1440	1
9787115356215	有趣的统计：75招学会数据分析	29.99	https://www.ituring.com.cn/book/1094	1094	1
9787115366474	AngularJS权威教程	49.99	https://www.ituring.com.cn/book/1438	1438	1
9787115363152	Web渗透测试：使用Kali Linux	29.99	https://www.ituring.com.cn/book/1347	1347	1
9787115357007	C++程序设计：现代方法	39.99	https://www.ituring.com.cn/book/1263	1263	1
9787115363404	HTML5与CSS3实例教程（第2版）	24.99	https://www.ituring.com.cn/book/1304	1304	1
9787115359087	创业的智慧：世界顶级创业导师的洞见	29.99	https://www.ituring.com.cn/book/1190	1190	1
9787115360366	图解网络硬件	34.99	https://www.ituring.com.cn/book/1166	1166	1
9787115355744	浴缸里的惊叹：256道让你恍然大悟的趣题	18.00	https://www.ituring.com.cn/book/1417	1417	1
9787115359360	Linux就是这个范儿	49.99	https://www.ituring.com.cn/book/1435	1435	1
9787115357335	Android编程实战	29.99	https://www.ituring.com.cn/book/1301	1301	1
9787115357014	SEO教程：搜索引擎优化入门与进阶（第3版）	29.99	https://www.ituring.com.cn/book/1456	1456	1
9787115355089	软件故事：谁发明了那些经典的编程语言	18.00	https://www.ituring.com.cn/book/879	879	1
9787115352323	Python计算机视觉编程	29.99	https://www.ituring.com.cn/book/1349	1349	1
9787115356826	机器学习系统设计	19.99	https://www.ituring.com.cn/book/1192	1192	1
9787115355645	两周自制脚本语言	29.99	https://www.ituring.com.cn/book/1215	1215	1
9787115354570	Erlang程序设计（第2版）	39.99	https://www.ituring.com.cn/book/1264	1264	1
9787115336552	流程的永恒之道：工作流及BPM技术的理论、规范、模式及最佳实践	39.99	https://www.ituring.com.cn/book/1275	1275	1
9787115349316	谷歌和亚马逊如何做产品	24.99	https://www.ituring.com.cn/book/1082	1082	1
9787115351708	学习R	29.99	https://www.ituring.com.cn/book/1187	1187	1
9787115352750	不脑残科学	19.99	https://www.ituring.com.cn/book/1377	1377	1
9787115349309	互联网思维的企业（入选中国好书榜）	24.99	https://www.ituring.com.cn/book/1133	1133	1
9787115350657	HTML5与CSS3基础教程（第8版） 【Web开发百万级畅销图书，零起点轻松掌握HTML5和CSS3】	29.99	https://www.ituring.com.cn/book/1199	1199	1
9787115353016	Sass与Compass实战	19.99	https://www.ituring.com.cn/book/1350	1350	1
9787115351531	图解HTTP	19.99	https://www.ituring.com.cn/book/1229	1229	1
9787115349101	Web性能权威指南	29.99	https://www.ituring.com.cn/book/1194	1194	1
9787115351470	软件定义网络：SDN与OpenFlow解析（迄今为止SDN领域最权威最重要的著作）	31.99	https://www.ituring.com.cn/book/1261	1261	1
9787115345370	黑客与设计：剖析设计之美的秘密	39.99	https://www.ituring.com.cn/book/893	893	1
9787115338693	Vim实用技巧	35.99	https://www.ituring.com.cn/book/1416	1416	1
9787115349354	网络游戏核心技术与实战	39.99	https://www.ituring.com.cn/book/1096	1096	1
9787115346421	深入理解C#（第3版）	39.99	https://www.ituring.com.cn/book/1200	1200	1
9787115347237	精通Ext JS	29.99	https://www.ituring.com.cn/book/1189	1189	1
9787115345844	软件测试实战：微软技术专家经验总结	29.99	https://www.ituring.com.cn/book/1346	1346	1
9787115347220	Mahout实战	31.99	https://www.ituring.com.cn/book/862	862	1
9787115344656	产品经理那些事儿	24.99	https://www.ituring.com.cn/book/1334	1334	1
9787115344489	深入理解C指针（C/C++程序员进阶必备，透彻理解指针与内存管理）	19.99	https://www.ituring.com.cn/book/1147	1147	1
9787115343710	jQuery Mobile开发指南	24.99	https://www.ituring.com.cn/book/1335	1335	1
9787302344155	交互设计的艺术： iOS 7拟物化到扁平化革命	55.30	https://www.ituring.com.cn/book/1475	1475	1
9787302346395	形式感+ —— 网页视觉设计创意拓展与快速表现	41.99	https://www.ituring.com.cn/book/1575	1575	1
9787302340522	Linux系统移植（第2版）	48.30	https://www.ituring.com.cn/book/1615	1615	1
9787302335283	Linux网络编程（第2版）	62.30	https://www.ituring.com.cn/book/1616	1616	1
9787302340522	ARM嵌入式Linux系统开发详解（第2版）	48.30	https://www.ituring.com.cn/book/1518	1518	1
9787302337768	Linux驱动开发入门与实战（第2版）	48.30	https://www.ituring.com.cn/book/1524	1524	1
9787115342942	软件开发与创新：ThoughtWorks文集（续集）	29.99	https://www.ituring.com.cn/book/1109	1109	1
9787115338891	30天软件开发：告别瀑布拥抱敏捷	19.99	https://www.ituring.com.cn/book/1059	1059	1
9787115337436	建筑中的数学之旅	29.99	https://www.ituring.com.cn/book/1090	1090	1
9787302338741	深入浅出：Windows 8.1应用开发	48.30	https://www.ituring.com.cn/book/1493	1493	1
9787115341334	Hadoop基础教程	19.99	https://www.ituring.com.cn/book/1168	1168	1
9787115341082	MongoDB权威指南（第2版）	31.99	https://www.ituring.com.cn/book/1172	1172	1
9787115339409	Python数据分析基础教程：NumPy学习指南（第2版）	19.99	https://www.ituring.com.cn/book/1226	1226	1
9787115337481	咨询的奥秘：寻求和提出建议的智慧	17.99	https://www.ituring.com.cn/book/1150	1150	1
9787115338181	CPU自制入门	49.99	https://www.ituring.com.cn/book/1142	1142	1
9787115335661	可能与不可能的边界：P/NP问题趣史	24.99	https://www.ituring.com.cn/book/1184	1184	1
9787115331809	信息简史	39.99	https://www.ituring.com.cn/book/731	731	1
9787115335630	你的灯亮着吗？发现问题的真正所在	19.50	https://www.ituring.com.cn/book/1080	1080	1
9787115335388	社会工程：安全体系中的人性漏洞	29.99	https://www.ituring.com.cn/book/981	981	1
9787115335500	深入浅出Node.js	39.99	https://www.ituring.com.cn/book/1290	1290	1
9787115330321	汽车是怎样跑起来的	18.00	https://www.ituring.com.cn/book/1135	1135	1
9787115333209	自制编程语言	39.99	https://www.ituring.com.cn/book/1159	1159	1
9787115334671	程序员第二步——从程序员到项目经理	18.00	https://www.ituring.com.cn/book/1291	1291	1
9787115333742	Python编程入门（第3版）	24.99	https://www.ituring.com.cn/book/1196	1196	1
9787115319494	Clojure编程乐趣	35.99	https://www.ituring.com.cn/book/1458	1458	1
9787115330529	TCP Sockets编程	12.00	https://www.ituring.com.cn/book/1176	1176	1
9787115324924	每个人都会死，但我总以为自己不会	15.00	https://www.ituring.com.cn/book/908	908	1
9787115331748	领域专用语言实战	39.99	https://www.ituring.com.cn/book/836	836	1
9787115330550	jQuery基础教程（第4版）（国内第一本jQuery权威教程，一版再版，累计重印14次，不可错过的实战类经典技术著作！）	29.99	https://www.ituring.com.cn/book/1169	1169	1
9787115331618	微交互：细节设计成就卓越产品（设计大师唐&#183;诺曼作序，Gmail、Google Reader设计师Kevin Fox等设计界大牛鼎力推荐!）	17.99	https://www.ituring.com.cn/book/1223	1223	1
9787115329189	品味移动设计——iOS、Android、Windows Phone用户体验设计最佳实践	39.99	https://www.ituring.com.cn/book/1245	1245	1
9787115318848	嗨翻C语言	49.99	https://www.ituring.com.cn/book/1004	1004	1
9787115327734	迷茫的旅行商：一个无处不在的计算机算法问题	24.99	https://www.ituring.com.cn/book/1052	1052	1
9787115329912	NumPy攻略： Python科学计算与数据分析	29.99	https://www.ituring.com.cn/book/1183	1183	1
9787115327352	Bootstrap用户手册：设计响应式网站（GitHub有史以来最受欢迎的开源项目，中文版使用指南面面俱到，一册在手，别无所求！）	14.99	https://www.ituring.com.cn/book/1124	1124	1
9787115328489	黑客攻防技术宝典：iOS实战篇	39.99	https://www.ituring.com.cn/book/1068	1068	1
9787302324614	DRBD 权威指南：基于Corosync+Heartbeat 技术构建网络RAID	41.99	https://www.ituring.com.cn/book/1523	1523	1
9787115324542	易用为王：改进产品设计的10个策略	29.99	https://www.ituring.com.cn/book/1088	1088	1
9787302326618	DB2设计、管理与性能优化艺术	55.30	https://www.ituring.com.cn/book/1498	1498	1
9787302318071	防线：企业Linux 安全运维理念和实战	55.30	https://www.ituring.com.cn/book/1624	1624	1
9787115321954	Java程序员修炼之道	49.99	https://www.ituring.com.cn/book/1027	1027	1
9787115322913	放飞App：移动产品经理实战指南	24.99	https://www.ituring.com.cn/book/789	789	1
9787115318756	世界是数字的（谷歌常务董事长施密特和盖茨及扎克伯格导师刘易斯重磅推荐）	17.99	https://www.ituring.com.cn/book/1039	1039	1
9787115318855	Cucumber：行为驱动开发指南	35.99	https://www.ituring.com.cn/book/1368	1368	1
9787115312242	七周七数据库	35.99	https://www.ituring.com.cn/book/1369	1369	1
9787302324294	ASP.NET MVC 4 开发指南	41.99	https://www.ituring.com.cn/book/1617	1617	1
9787115320117	数据可视化实战：使用D3设计交互式图表	24.99	https://www.ituring.com.cn/book/1126	1126	1
9787115317957	机器学习实战	39.99	https://www.ituring.com.cn/book/1021	1021	1
9787115314642	Android开发入门与实战（第二版）	35.99	https://www.ituring.com.cn/book/1359	1359	1
9787115317513	代码的未来	39.99	https://www.ituring.com.cn/book/1073	1073	1
9787115316578	JavaScript异步编程：设计快速响应的网络应用	18.99	https://www.ituring.com.cn/book/1132	1132	1
9787115316899	理解Unix进程	17.99	https://www.ituring.com.cn/book/1081	1081	1
9787115313973	结网@改变世界的互联网产品经理（修订版）	19.99	https://www.ituring.com.cn/book/1157	1157	1
9787115313089	设计师要懂心理学	24.99	https://www.ituring.com.cn/book/874	874	1
9787115313980	SQL必知必会（第4版）	12.00	https://www.ituring.com.cn/book/1102	1102	1
9787115312945	Redis入门指南	24.99	https://www.ituring.com.cn/book/1357	1357	1
9787302322207	iOS网络编程与云端应用最佳实践	48.30	https://www.ituring.com.cn/book/1492	1492	1
9787302322221	Xilinx All Programmable Zynq-7000 SoC设计指南	55.30	https://www.ituring.com.cn/book/1620	1620	1
9787115311498	学习正则表达式	17.99	https://www.ituring.com.cn/book/955	955	1
9787115312181	iOS 6编程实战（国内首本iOS 6  深度揭秘iOS 6高级特性与开发技巧）	59.99	https://www.ituring.com.cn/book/1053	1053	1
9787115311504	腾云：云计算和大数据时代网络技术揭秘（国内第一本云计算网络书）	29.99	https://www.ituring.com.cn/book/966	966	1
9787115310118	App创富传奇	17.99	https://www.ituring.com.cn/book/947	947	1
9787115305404	精益创业实战（第2版）（精益系列丛书，《精益创业》作者埃里克&#183;莱斯主编）	18.00	https://www.ituring.com.cn/book/949	949	1
9787115306180	Node即学即用	17.99	https://www.ituring.com.cn/book/855	855	1
9787115302946	jQuery Mobile即学即用	24.99	https://www.ituring.com.cn/book/1002	1002	1
9787115301550	深入浅出PhoneGap	29.99	https://www.ituring.com.cn/book/1084	1084	1
9787115302410	神奇的数学：牛津教授给青少年的讲座	24.50	https://www.ituring.com.cn/book/906	906	1
9787115302380	简约之美：软件设计之道	12.99	https://www.ituring.com.cn/book/957	957	1
9787115301956	程序员面试逻辑题解析	18.00	https://www.ituring.com.cn/book/934	934	1
9787115300676	OSGi实战	49.99	https://www.ituring.com.cn/book/905	905	1
9787115301994	云端代码：Google App Engine编程指南	24.99	https://www.ituring.com.cn/book/970	970	1
9787115299482	iOS游戏开发：从创意到实现	19.99	https://www.ituring.com.cn/book/1003	1003	1
9787115300294	Kinect人机交互开发实践	19.99	https://www.ituring.com.cn/book/965	965	1
9787115296481	移动应用UI设计模式	24.99	https://www.ituring.com.cn/book/958	958	1
9787115282149	图灵的秘密：他的生平、思想及论文解读	29.99	https://www.ituring.com.cn/book/801	801	1
9787115296382	深入NoSQL	34.99	https://www.ituring.com.cn/book/845	845	1
9787115295347	LBS应用开发	29.99	https://www.ituring.com.cn/book/865	865	1
9787115295897	Mac功夫：OS X的300多个技巧和小窍门	24.99	https://www.ituring.com.cn/book/1020	1020	1
9787115295088	卓越程序员密码	11.99	https://www.ituring.com.cn/book/1024	1024	1
9787115307460	众妙之门：网站UI设计之道（修订版）	14.99	https://www.ituring.com.cn/book/1216	1216	1
9787115295071	MongoDB实战	29.99	https://www.ituring.com.cn/book/929	929	1
9787115294432	DBA的思想天空——感悟Oracle数据库本质	24.99	https://www.ituring.com.cn/book/972	972	1
9787115293817	鲜活的数据：数据可视化指南	29.99	https://www.ituring.com.cn/book/819	819	1
9787115290267	实例化需求：团队如何交付正确的软件	24.99	https://www.ituring.com.cn/book/837	837	1
9787115291776	精益开发实战：用看板管理大型项目	11.99	https://www.ituring.com.cn/book/1029	1029	1
9787115291783	iOS应用开发攻略	17.99	https://www.ituring.com.cn/book/840	840	1
9787115289094	别怕，Excel VBA其实很简单	29.40	https://www.ituring.com.cn/book/1324	1324	1
9787115281487	HTTP权威指南	59.99	https://www.ituring.com.cn/book/844	844	1
9787115290441	捉虫日记	11.99	https://www.ituring.com.cn/book/909	909	1
9787115287960	30天自制操作系统	49.99	https://www.ituring.com.cn/book/910	910	1
9787115290366	Go语言编程	19.99	https://www.ituring.com.cn/book/967	967	1
9787115285591	Erlang/OTP并发编程实战	39.99	https://www.ituring.com.cn/book/828	828	1
9787115283993	Node.js开发指南	17.99	https://www.ituring.com.cn/book/1049	1049	1
9787115281609	锋利的jQuery(第2版)	29.40	https://www.ituring.com.cn/book/1222	1222	1
9787302287858	网站蓝图——Axure RP高保真网页原型制作	49.99	https://www.ituring.com.cn/book/1619	1619	1
9787115275868	思考的乐趣：Matrix67数学笔记	18.00	https://www.ituring.com.cn/book/890	890	1
9787115281548	敏捷武士：看敏捷高手交付卓越软件	14.99	https://www.ituring.com.cn/book/835	835	1
9787115283924	黑客攻防技术宝典：Web实战篇（第2版）	49.99	https://www.ituring.com.cn/book/885	885	1
9787115284792	精彩绝伦的CSS	23.99	https://www.ituring.com.cn/book/924	924	1
9787115283818	Unity 3D游戏开发	24.99	https://www.ituring.com.cn/book/1015	1015	1
9787115279262	金领简历：敲开苹果、微软、谷歌的大门	11.99	https://www.ituring.com.cn/book/818	818	1
9787115281586	推荐系统实践	19.99	https://www.ituring.com.cn/book/894	894	1
9787115283078	Go语言&#183;云动力	17.99	https://www.ituring.com.cn/book/1040	1040	1
9787115276674	他山之石：TechStars孵化器中的创业真经	17.99	https://www.ituring.com.cn/book/896	896	1
9787115279293	出国不出国——北美金字塔教育的启示	12.99	https://www.ituring.com.cn/book/1289	1289	1
9787115280657	精彩绝伦的jQuery	29.99	https://www.ituring.com.cn/book/986	986	1
9787115278708	论道HTML5	23.99	https://www.ituring.com.cn/book/960	960	1
9787115279743	深入浅出CoffeeScript	11.99	https://www.ituring.com.cn/book/897	897	1
9787115276704	网站转换率优化之道	11.99	https://www.ituring.com.cn/book/767	767	1
9787115278326	Node Web开发	12.00	https://www.ituring.com.cn/book/833	833	1
9787115276117	七周七语言：理解多种编程范型	14.99	https://www.ituring.com.cn/book/829	829	1
9787115270030	Cisco IPSec VPN 实战指南	32.99	https://www.ituring.com.cn/book/1250	1250	1
9787115277619	写给大家看的色彩书2——色彩怎么选，设计怎么做	29.99	https://www.ituring.com.cn/book/1343	1343	1
9787115274946	深入HTML5应用开发	29.99	https://www.ituring.com.cn/book/943	943	1
9787115275790	JavaScript高级程序设计（第3版）	49.99	https://www.ituring.com.cn/book/946	946	1
9787115274571	jQuery实战（第2版）	29.99	https://www.ituring.com.cn/book/871	871	1
9787115271075	任天堂传奇：游戏产业之王者归来	18.00	https://www.ituring.com.cn/book/759	759	1
9787115270443	软件之道：软件开发争议问题剖析	29.99	https://www.ituring.com.cn/book/797	797	1
9787115273581	好学的Objective-C	24.99	https://www.ituring.com.cn/book/870	870	1
9787115272119	深入学习MongoDB	17.99	https://www.ituring.com.cn/book/814	814	1
9787115273680	IDA Pro权威指南（第2版）	39.99	https://www.ituring.com.cn/book/791	791	1
9787115269836	精通QTP：自动化测试技术领航	41.40	https://www.ituring.com.cn/book/1235	1235	1
9787115265913	你就是极客！软件开发人员生存指南	11.99	https://www.ituring.com.cn/book/743	743	1
9787115267665	cocos2d-x手机游戏开发：跨iOS、Android和沃Phone平台	17.99	https://www.ituring.com.cn/book/813	813	1
9787115267276	布道之道：引领团队拥抱技术创新	11.99	https://www.ituring.com.cn/book/736	736	1
9787115264312	编程大师访谈录	24.99	https://www.ituring.com.cn/book/750	750	1
9787115267245	HTML5和CSS3实例教程	19.99	https://www.ituring.com.cn/book/766	766	1
9787115264725	Linux Shell脚本攻略	24.99	https://www.ituring.com.cn/book/764	764	1
9787115265562	JavaScript修炼之道	12.00	https://www.ituring.com.cn/book/762	762	1
9787115259615	营销十法：社交网络时代成功企业怎样推广品牌	19.99	https://www.ituring.com.cn/book/754	754	1
9787115262066	大话移动通信	26.99	https://www.ituring.com.cn/book/1218	1218	1
9787115260932	PHP基础教程（第4版）	17.99	https://www.ituring.com.cn/book/741	741	1
9787115261274	SQL反模式	17.99	https://www.ituring.com.cn/book/738	738	1
9787115259110	写给程序员的Web设计书	11.99	https://www.ituring.com.cn/book/1	1	1
9787115255075	松本行弘的程序世界	39.99	https://www.ituring.com.cn/book/727	727	1
9787115259653	软件项目成功之道	6.00	https://www.ituring.com.cn/book/3	3	1
9787115258540	Cassandra权威指南	29.99	https://www.ituring.com.cn/book/9	9	1
9787115251008	项目经理应该知道的97件事	17.99	https://www.ituring.com.cn/book/10	10	1
9787115252647	软件调试修炼之道	11.99	https://www.ituring.com.cn/book/24	24	1
9787115252197	云计算核心技术剖析	24.99	https://www.ituring.com.cn/book/28	28	1
9787302249894	大话存储Ⅱ——存储系统架构与底层原理极限剖析	39.99	https://www.ituring.com.cn/book/1579	1579	1
9787115249494	黑客与画家：硅谷创业之父Paul Graham文集	12.00	https://www.ituring.com.cn/book/39	39	1
9787115248589	iPhone与iPad开发实战	29.99	https://www.ituring.com.cn/book/51	51	1
9787115247841	人人都有好工作：IT行业求职面试必读	17.99	https://www.ituring.com.cn/book/52	52	1
9787115247315	数学那些事儿：思想、发现、人物和历史	12.00	https://www.ituring.com.cn/book/55	55	1
9787115244277	Windows API 开发详解——函数、接口、编程实例	47.40	https://www.ituring.com.cn/book/1243	1243	1
9787115246462	精通COBOL—大型机商业编程技术详解（修订版）	35.40	https://www.ituring.com.cn/book/1251	1251	1
9787115244888	项目百态：深入理解软件项目行为模式	17.99	https://www.ituring.com.cn/book/59	59	1
9787115246691	番茄工作法图解：简单易行的时间管理方法	19.50	https://www.ituring.com.cn/book/60	60	1
9787302239239	研磨设计模式	35.99	https://www.ituring.com.cn/book/1577	1577	1
9787115243188	门后的秘密：卓越管理的故事	9.99	https://www.ituring.com.cn/book/70	70	1
9787115242334	程序员的思维修炼：开发认知潜能的九堂课	11.99	https://www.ituring.com.cn/book/77	77	1
9787115240576	调试九法：软硬件错误的排查之道	11.99	https://www.ituring.com.cn/book/84	84	1
9787115238368	测试驱动开发的艺术	29.99	https://www.ituring.com.cn/book/112	112	1
9787302266372	P道理——ERP项目实施手记	19.99	https://www.ituring.com.cn/book/1497	1497	1
9787115233523	我编程，我快乐：程序员职业规划之道	17.99	https://www.ituring.com.cn/book/136	136	1
9787115232175	微积分的历程：从牛顿到勒贝格	14.99	https://www.ituring.com.cn/book/147	147	1
9787115227973	只为拍张好照片— —懒家伙的摄影入门书	24.99	https://www.ituring.com.cn/book/1338	1338	1
9787115230713	Oracle优化日记：一个金牌DBA的故事	23.99	https://www.ituring.com.cn/book/158	158	1
9787115227430	深入Linux内核架构	77.99	https://www.ituring.com.cn/book/167	167	1
9787115228215	Linux程序设计(第4版)	59.99	https://www.ituring.com.cn/book/171	171	1
9787115221094	精通软件性能测试与LoadRunner实战	41.40	https://www.ituring.com.cn/book/1246	1246	1
9787115224019	系统程序员成长计划	19.99	https://www.ituring.com.cn/book/196	196	1
9787115215536	高效程序员的45个习惯：敏捷开发修炼之道	17.99	https://www.ituring.com.cn/book/218	218	1
9787115217417	大话无线通信	26.99	https://www.ituring.com.cn/book/1219	1219	1
9787115213969	软件调试的艺术	19.99	https://www.ituring.com.cn/book/238	238	1
9787115213617	项目管理修炼之道	11.99	https://www.ituring.com.cn/book/255	255	1
9787115213600	软件开发沉思录：ThoughtWorks文集	19.99	https://www.ituring.com.cn/book/271	271	1
9787115204400	大话通信：通信基础知识读本	24.99	https://www.ituring.com.cn/book/1217	1217	1
9787115191120	MySQL必知必会	24.50	https://www.ituring.com.cn/book/387	387	1
9787115182623	嵌入式Linux 应用开发完全手册	41.40	https://www.ituring.com.cn/book/1234	1234	1
9787115164742	正则表达式必知必会	14.99	https://www.ituring.com.cn/book/509	509	1
\.


--
-- Name: ebooks ebooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ebooks
    ADD CONSTRAINT ebooks_pkey PRIMARY KEY (isbn, bookid);


--
-- PostgreSQL database dump complete
--

