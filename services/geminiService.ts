import { AnalysisResult, RiskLevel } from "../types";

// MOCK SERVICE - API REMOVED AS REQUESTED
// This service simulates the AI analysis without needing an API key.

export const analyzeScamContent = async (text: string, images: File[]): Promise<AnalysisResult> => {
  // Simulate AI processing latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();

  // --- SCENARIO 1: Pig Butchering (杀猪盘) ---
  if (lowerText.includes("杀猪盘") || lowerText.includes("投资") || lowerText.includes("比特币") || lowerText.includes("usdt")) {
    return {
      riskScore: 98,
      riskLevel: RiskLevel.CRITICAL,
      summary: "【模拟结果：杀猪盘】系统检测到极高风险的‘杀猪盘’（Pig Butchering Scam）特征。骗子通过长期的情感培养建立信任，随后引入投资话题。这种模式通常会导致受害者遭受巨额财产损失。",
      generatedConversation: `[20:15] 骗子: 亲爱的，还在加班吗？心疼你，记得吃饭。🌹
[20:30] 受害者: 刚忙完，准备回去了。
[20:35] 骗子: 辛苦啦！为了我们的未来，现在努力一点也是值得的。对了，今天比特币那个节点收益不错，我刚才提了500U出来，打算给你买个礼物。🎁
[20:40] 受害者: 你怎么老是在弄这个呀，我不懂这些。
[20:42] 骗子: 傻瓜，为了让我们以后生活更自由呀。其实很简单的，我舅舅在华尔街做了20年，有内幕消息。要不带你体验一下？就投几百块，赚了算你的，亏了算我的。
[20:45] 受害者: 真的稳赚不赔吗？
[20:46] 骗子: 放心吧，有我在呢。你下载这个‘SecureWallet’（虚假APP），我教你操作，几分钟就能看到收益。`,
      scammerMotive: "利用虚假的‘高额回报’和‘情感关系’作为诱饵，核心目的是诱导受害者将资金转入其控制的诈骗平台。",
      expectedOutcome: "受害者在初期小额获利并成功提现后，会放松警惕，投入大额资金。随后平台会以‘税务问题’、‘违规操作’为由冻结账户，要求缴纳更多费用，最终骗子失联。",
      redFlags: [
        "无缘无故的过度关心和‘未来许诺’",
        "提及‘内幕消息’、‘稳赚不赔’",
        "诱导下载非官方应用商店的APP",
        "试图将话题引导至金钱投资",
        "承诺‘亏了算我的’来降低受害者心理防线"
      ],
      psychologicalTactics: [
        "杀猪盘 (Pig Butchering)",
        "情感轰炸 (Love Bombing)",
        "沉没成本谬误 (Sunk Cost Fallacy)",
        "制造稀缺感与紧迫感"
      ],
      verificationStrategies: [
        {
          type: "技术装傻 (Feigned Incompetence)",
          explanation: "假装不会操作，看对方反应。",
          reply: "亲爱的，我手机提示这个APP有病毒，禁止安装，怎么办呀？我是不是太笨了？😰",
          expectedReaction: "骗子会非常急切，甚至发视频教程教你关闭手机安全防护，或者让你换个手机试试。"
        },
        {
          type: "视频验证 (Video Call)",
          explanation: "验证对方身份真实性。",
          reply: "打字好累，我们视频聊一会吧？想看看你。",
          expectedReaction: "找理由拒绝（如：在开密会、摄像头坏了、网络不好），或者视频画面与本人不符（AI换脸痕迹）。"
        },
        {
          type: "资金隔离 (Money Rejection)",
          explanation: "直接拒绝金钱话题。",
          reply: "我答应过家里人，绝对不碰任何投资理财的东西。我们只谈感情好吗？",
          expectedReaction: "如果是骗子，态度会立刻冷淡，甚至直接消失，因为你没有‘利用价值’了。"
        }
      ],
      actionableAdvice: "这是一个典型的杀猪盘骗局。请立即停止任何转账行为，不要点击对方发送的链接。保存所有聊天记录作为证据，并向反诈中心举报。",
      scamAlertMessage: "🚨 极度危险预警 (SCAM ALERT)\n\n致当事人：\n这是一个典型的【杀猪盘】网络诈骗陷阱！\n\n🤖 AI 智能诊断结果：\n对方正在对你使用情感诱导心理战术，目的是掏空你的钱包。\n\n请立即执行：\n1. 🛑 停止转账（无论对方说得多紧急）。\n2. 🛑 不要点击链接（可能有木马）。\n3. 🛑 马上拉黑（不要试图感化骗子）。\n\n相信数据的判断，不要相信屏幕对面的陌生人。"
    };
  }

  // --- SCENARIO 2: Fake Customer Service (假客服) ---
  if (lowerText.includes("客服") || lowerText.includes("征信") || lowerText.includes("京东") || lowerText.includes("注销")) {
    return {
      riskScore: 95,
      riskLevel: RiskLevel.CRITICAL,
      summary: "【模拟结果：冒充客服】系统识别为典型的‘冒充客服/征信诈骗’。骗子通常冒充京东、支付宝或银行客服，以‘注销校园贷’、‘修复征信’或‘误开通会员’为由，通过恐吓手段迫使受害者转账。",
      generatedConversation: `[10:00] 骗子: 您好，我是京东金融客服工号9527。系统检测到您的京东金条利率过高，不符合国家最新监管规定。
[10:01] 受害者: 啊？那我该怎么办？
[10:02] 骗子: 您需要配合我们进行‘资金清算’并注销账户，否则将严重影响您的个人征信（人民银行征信系统）。这会影响您以后买房买车贷款。
[10:03] 受害者: 这么严重吗？但我没用过金条啊。
[10:04] 骗子: 是因为您之前注册信息被误关联了。请您现在下载‘瞩目’或者是‘腾讯会议’APP，开启屏幕共享，我指导您操作后台消除记录。
[10:05] 受害者: 好的，我下载好了。
[10:06] 骗子: 好的，现在请您打开银行APP，为了验证资金流向，您需要将余额转入我们的‘银监会认证对接账户’，验证完成后资金会自动原路退回。`,
      scammerMotive: "利用受害者对‘个人征信’的恐惧心理，诱导开启‘屏幕共享’以此窃取验证码，或直接诱导转账到所谓的‘安全账户’。",
      expectedOutcome: "受害者在恐慌中将所有积蓄转给骗子，甚至去其他贷款平台借款转账。骗子得手后立即拉黑。",
      redFlags: [
        "冒充大平台官方客服（且多用私人手机号来电）",
        "提及‘影响征信’、‘坐牢’等恐吓性词汇",
        "要求下载‘视频会议软件’开启屏幕共享",
        "要求转账到‘安全账户’或‘认证账户’"
      ],
      psychologicalTactics: [
        "权威暗示 (Authority Bias)",
        "恐惧诉求 (Fear Appeal)",
        "时间紧迫感 (Urgency)"
      ],
      verificationStrategies: [
        {
          type: "官方核实 (Official Verification)",
          explanation: "不轻信来电，反向拨打官方电话。",
          reply: "麻烦你提供一下工号，我现在挂断电话，直接打京东官方客服热线核实一下。",
          expectedReaction: "骗子会极力阻止你挂电话，说‘官方热线繁忙’、‘这是内部专线’或威胁‘挂断就无法处理征信’。"
        },
        {
          type: "屏幕共享陷阱测试 (Screen Share Trap)",
          explanation: "拒绝高风险操作。",
          reply: "我老公是警察，他说凡是让开屏幕共享的都是诈骗。要不我让他来跟你说？",
          expectedReaction: "骗子听到警察会非常心虚，通常会直接挂断电话或破口大骂。"
        },
        {
          type: "拖延战术 (Stalling)",
          explanation: "打破对方的紧迫节奏。",
          reply: "我现在正在开会，征信黑就黑吧，无所谓了，等我晚上下班再说。",
          expectedReaction: "骗子会更加焦急，强调事情的严重性，试图把你拉回他的节奏中。"
        }
      ],
      actionableAdvice: "官方客服绝不会要求你‘屏幕共享’，也绝不会让你转账到私人账户。凡是提到‘注销校园贷’、‘影响征信’的电话，一律挂断。",
      scamAlertMessage: "🛑 诈骗阻断警报 (SCAM ALERT)\n\n注意！正在与你通话的可能是【假冒客服】！\n\n诊断依据：\n1. 对方提到了“影响征信”或“注销账户”。\n2. 对方要求开启“屏幕共享”或“视频会议”。\n3. 对方要求转账到“指定账户”。\n\n请立即挂断电话！\n请立即挂断电话！\n请立即挂断电话！\n\n如有疑问，请自己去官方APP找客服，不要信电话里的人。"
    };
  }

  // --- SCENARIO 3: Brushing / Part-time Job (刷单兼职) ---
  if (lowerText.includes("刷单") || lowerText.includes("兼职") || lowerText.includes("点赞") || lowerText.includes("任务")) {
    return {
      riskScore: 92,
      riskLevel: RiskLevel.CRITICAL,
      summary: "【模拟结果：刷单诈骗】系统识别为‘兼职刷单’或‘做任务’诈骗。骗子通常以‘动动手指月入过万’、‘给抖音点赞’为诱饵，前期给小额甜头，后期诱导大额充值。",
      generatedConversation: `[14:00] 骗子: 您好，我们在招募线上兼职，给短视频点赞，一单3-5元，日结，时间自由。
[14:05] 受害者: 真的假的？不需要交押金吧？
[14:06] 骗子: 绝对正规，不需要任何押金。您可以先试做一单，关注这个公众号，截图给我，立刻给您发3元红包。
[14:10] (受害者尝试并收到了3元红包)
[14:15] 骗子: 亲，您看很容易吧？现在我们有更高收益的任务，需要下载我们的接单APP。在APP里帮商家‘垫资采购’冲销量，佣金是本金的20%，做完本金佣金立返。
[14:20] 受害者: 这个要自己先垫钱吗？
[14:22] 骗子: 是的，这是为了模拟真实购物流程。您可以先试个300元的小单，5分钟后返您360元。这也是为了筛选诚意兼职人员。`,
      scammerMotive: "利用‘无需押金’和‘首单尝甜头’降低防备，目的是诱导受害者进行大额‘垫资’，最后以‘联单未完成’、‘操作失误’为由拒绝返款。",
      expectedOutcome: "受害者垫资几千甚至几万元后，发现无法提现，且被要求继续充值‘解冻资金’。",
      redFlags: [
        "声称‘高薪低门槛’、‘动动手指赚钱’",
        "要求下载非正规应用商店的APP",
        "前期给予小额返利（糖衣炮弹）",
        "要求‘垫资’、‘充值’做任务",
        "出现‘联单’、‘数据错误’等术语"
      ],
      psychologicalTactics: [
        "登门槛效应 (Foot-in-the-door)",
        "利益诱惑",
        "沉没成本谬误"
      ],
      verificationStrategies: [
        {
          type: "拒绝垫资 (No Advance Payment)",
          explanation: "坚守不掏钱的底线。",
          reply: "我可以做点赞关注的任务，但是凡是需要我先垫钱的一律不做。我没钱。",
          expectedReaction: "骗子会试图说服你‘舍不得孩子套不着狼’，或者说‘这是为了做数据’。如果坚持不垫资，对方会放弃你。"
        },
        {
          type: "反向索要 (Reverse Demand)",
          explanation: "打乱对方节奏。",
          reply: "既然公司这么有实力，能不能先预付我50%的佣金？我怕你们跑路。",
          expectedReaction: "骗子会以‘公司规定’、‘系统流程’为由拒绝，并指责你不信任他们。"
        }
      ],
      actionableAdvice: "所有要求‘垫资’、‘充值’的兼职都是诈骗。天上不会掉馅饼，正规兼职绝不会让你先交钱。",
      scamAlertMessage: "🚫 刷单兼职警报 (SCAM ALERT)\n\n请立刻停止操作！\n\nAI 判定：这是【刷单诈骗】\n\n骗子套路：\n1. 先给你几块钱甜头（点赞/关注）。\n2. 诱导你下载APP进行“垫资任务”。\n3. 你充值后，永远无法提现。\n\n记住：凡是要求先垫钱的兼职，100%是诈骗！"
    };
  }

  // Generic response
  return {
    riskScore: 85,
    riskLevel: RiskLevel.DANGEROUS,
    summary: "系统分析显示，该内容具有较高的风险特征。对方身份信息模糊，且存在试图引导话题或建立某种操控关系的倾向。建议保持高度警惕。",
    scammerMotive: "初步判定为试图建立信任（建立人设），可能为后续的‘杀猪盘’、‘借款诈骗’或‘隐私窃取’做铺垫。",
    expectedOutcome: "在获取受害者信任后，可能会突然遭遇‘意外’需要借钱，或者推荐虚假投资理财产品。",
    redFlags: [
      "身份背景过于完美或难以核实",
      "对话节奏由对方强力主导",
      "可能存在逻辑前后不一致的情况",
      "对个人隐私信息的探听"
    ],
    psychologicalTactics: [
      "光环效应 (Halo Effect)",
      "信息不对称利用",
      "快速推进关系 (Rushing Intimacy)"
    ],
    verificationStrategies: [
      {
        type: "背景核实 (Background Check)",
        explanation: "通过询问具体细节来核实真实性。",
        reply: "你之前说你在[某地]工作，那边最近是不是在修那条[虚构的路/地标]呀？我朋友说很堵。",
        expectedReaction: "如果对方不在该地，可能会顺着你的话说，或者含糊其辞。"
      },
      {
        type: "拒绝服从 (Saying No)",
        explanation: "设立边界，看对方反应。",
        reply: "我不喜欢把照片发给没见过面的人，我们可以先只语音聊天吗？",
        expectedReaction: "骗子通常会表现出不满，试图用‘你不信任我’来让你感到内疚（煤气灯效应）。"
      },
      {
        type: "第三方验证 (Third Party proof)",
        explanation: "要求通过第三方平台验证。",
        reply: "你的领英(LinkedIn)或者是公司官网链接能发我一下吗？我想多了解一下你的行业。",
        expectedReaction: "以‘隐私’、‘公司保密’为由拒绝提供公开可查的信息。"
      }
    ],
    actionableAdvice: "不要轻易透露个人财务状况或家庭住址。建议尝试通过反向搜图检查对方头像是否为网图。在完全确认身份前，保持怀疑态度。",
    scamAlertMessage: "⚠️ 安全警告：检测到可疑活动\n\n请注意，对方的行为模式符合潜在诈骗的前期特征。\n\n建议：\n1. 不要发送私密照片。\n2. 不要进行任何金钱往来。\n3. 如果感觉不对劲，请相信直觉，立即结束对话。"
  };
};