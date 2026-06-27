import { defaultScoringRules } from "./config";
import type {
  Annotation,
  ContentOption,
  DocumentSection,
  ModuleContent,
  ModuleId,
} from "../types/content";

const option = (
  id: string,
  text: string,
  classification: string,
  feedbackCorrect: string,
  feedbackIncorrect: string,
  belongsToSectionId?: string,
  numericValue?: number,
): ContentOption => ({
  id,
  text,
  classification,
  feedbackCorrect,
  feedbackIncorrect,
  belongsToSectionId,
  numericValue,
});

const section = (
  values: Omit<DocumentSection, "selectionMode"> &
    Partial<Pick<DocumentSection, "selectionMode">>,
): DocumentSection => ({
  selectionMode: "single",
  ...values,
});

const pakaAnnotations: Annotation[] = [
  { id: "paka-missing", text: "המידע חסר", category: "completeness" },
  {
    id: "paka-vague",
    text: "הניסוח עמום או כללי מדי",
    category: "clarity",
  },
  {
    id: "paka-wrong-section",
    text: "התוכן שייך לסעיף אחר",
    category: "structure",
  },
  {
    id: "paka-contradiction",
    text: "קיימת סתירה פנימית",
    category: "consistency",
  },
  {
    id: "paka-no-owner",
    text: "לא הוגדר אחראי",
    category: "accountability",
  },
  {
    id: "paka-no-deadline",
    text: "לא הוגדר מועד",
    category: "timing",
  },
  {
    id: "paka-redundant",
    text: "המידע מיותר או חוזר על עצמו",
    category: "relevance",
  },
];

const riskAnnotations: Annotation[] = [
  {
    id: "risk-danger-confusion",
    text: "בלבול בין סכנה לסיכון",
    category: "concept",
  },
  {
    id: "risk-not-scenario",
    text: "הסיכון אינו מנוסח כתרחיש",
    category: "clarity",
  },
  {
    id: "risk-wrong-m5",
    text: "תחום M5 אינו מתאים",
    category: "classification",
  },
  {
    id: "risk-severity",
    text: "החומרה אינה הגיונית",
    category: "assessment",
  },
  {
    id: "risk-likelihood",
    text: "הסבירות אינה הגיונית",
    category: "assessment",
  },
  {
    id: "risk-level",
    text: "רמת הסיכון אינה תואמת",
    category: "calculation",
  },
  {
    id: "risk-weak-control",
    text: "הפעילות המתקנת אינה מטפלת בגורם",
    category: "mitigation",
  },
  {
    id: "risk-no-owner",
    text: "לא הוגדר אחראי",
    category: "accountability",
  },
  {
    id: "risk-no-deadline",
    text: "לא הוגדר מועד",
    category: "timing",
  },
  {
    id: "risk-no-residual",
    text: "לא הוערך סיכון שיורי",
    category: "assessment",
  },
  {
    id: "risk-no-monitoring",
    text: "חסרה בקרה או עדכון",
    category: "monitoring",
  },
];

const debriefAnnotations: Annotation[] = [
  {
    id: "debrief-interpretation",
    text: "מדובר בפרשנות ולא בעובדה",
    category: "evidence",
  },
  {
    id: "debrief-no-evidence",
    text: "חסר מידע לביסוס",
    category: "evidence",
  },
  {
    id: "debrief-no-timeline",
    text: "חסר רצף כרונולוגי",
    category: "timeline",
  },
  {
    id: "debrief-no-gap",
    text: "לא הוגדר פער ברור",
    category: "gap",
  },
  {
    id: "debrief-unsupported-conclusion",
    text: "המסקנה אינה נשענת על ממצא",
    category: "reasoning",
  },
  {
    id: "debrief-conclusion-lesson",
    text: "קיים בלבול בין מסקנה ללקח",
    category: "structure",
  },
  {
    id: "debrief-not-actionable",
    text: "הלקח אינו ישים או מדיד",
    category: "lesson",
  },
  {
    id: "debrief-no-owner",
    text: "לא הוגדר אחראי",
    category: "accountability",
  },
  {
    id: "debrief-no-deadline",
    text: "לא הוגדר מועד",
    category: "timing",
  },
  {
    id: "debrief-no-authority",
    text: "הפעולה אינה בסמכות ולכן צריכה להיות המלצה",
    category: "authority",
  },
  {
    id: "debrief-new-summary",
    text: "הסיכום מוסיף מידע חדש",
    category: "summary",
  },
];

const paka: ModuleContent = {
  id: "paka",
  number: 1,
  title: "פק״א",
  eyebrow: "פקודת ארגון",
  shortDescription:
    "מגדירים את המשימה, מטרותיה, שיטת הביצוע, לוחות הזמנים ותחומי האחריות.",
  transitionIn:
    "כאן מתחיל הרצף: לפני שמבצעים, מנסחים תמונה משותפת וברורה של המשימה.",
  transitionOut:
    "לאחר שהמשימה ברורה, צריך לבחון מה עלול לפגוע בביצועה, מה חומרת הפגיעה וכיצד ניתן לצמצם את הסיכון.",
  documentName: "פקודת ארגון — יום אימון צוותי",
  example: {
    title: "דוגמת פקודת ארגון",
    caption:
      "דוגמה מתוך חומרי הלמידה: מבנה פק״א עם כותרת, פרטי מסגרת, סעיפים ממוספרים, לו״ז ותחומי אחריות.",
    imageSrc: "/examples/paka-example.png",
    sourceLabel: "מתוך חומרי פק״א",
  },
  intro: {
    what:
      "פקודת ארגון היא מסמך צבאי המהווה פקודה לכל דבר ומודיע על קיום פעילות ביחידה.",
    why:
      "כדי לאפשר הוצאה מיטבית של משימה, ליצור שליטה ובקרה ולהבהיר לבעלי התפקידים מה נדרש מהם.",
    when:
      "לפני פעילות או משימה יחידתית שיש להגדיר, לארגן ולתאם בין בעלי תפקידים.",
    who:
      "המפקד ובעלי התפקידים המתכננים והמבצעים. הפקודה צריכה להיות ברורה גם למי שלא השתתף בשיחת התכנון.",
    enables:
      "פקודה מתומצתת ורלוונטית מאפשרת להבין מה צריך לקרות, מתי, כיצד ובאחריות מי.",
    connection:
      "הפק״א מגדירה את המשימה. לאחר מכן עוברים לניהול סיכונים כדי לבחון מה עלול לפגוע בביצועה.",
  },
  documentSections: [
    section({
      id: "general",
      title: "כללי",
      purpose: "להציג בקצרה מהי הפעילות ומה ההקשר שלה.",
      whatBelongs: "שם הפעילות, מועד, מקום, משתתפים והקשר נדרש.",
      commonMistakes:
        "פירוט ארוך של שיטת הביצוע או הסברים שאינם נחוצים להבנת המסגרת.",
      order: 1,
      prerequisiteIds: [],
      correctOptionIds: ["paka-general-correct"],
      options: [
        option(
          "paka-general-correct",
          "בתאריך 15.7, בשעות 07:30–15:30, יתקיים יום אימון צוותי במתחם ההכשרות בהשתתפות 24 צוערים בשלושה צוותים.",
          "נכון",
          "הבחירה מגדירה פעילות, מועד, מקום ומשתתפים בקצרה.",
          "",
        ),
        option(
          "paka-general-method",
          "בכל תחנה הצוות יבצע תרגיל במשך 45 דקות ולאחר מכן יעבור לתחנה הבאה.",
          "שייך לשיטה",
          "",
          "זהו תיאור של אופן הביצוע. הוא שייך לסעיף שיטה ולא למסגרת הכללית.",
          "method",
        ),
        option(
          "paka-general-vague",
          "יתקיים אימון חשוב לכל הצוערים במהלך היום.",
          "כללי מדי",
          "",
          "חסרים מועד מדויק, מקום, מספר משתתפים ומסגרת זמן שניתן לתכנן לפיהם.",
        ),
      ],
    }),
    section({
      id: "goals",
      title: "מטרות",
      purpose: "להגדיר אילו תוצאות רוצים להשיג באמצעות הפעילות.",
      whatBelongs: "תוצאות ברורות וממוקדות שהפעילות נועדה להשיג.",
      commonMistakes:
        "תיאור פעולות במקום תוצאות או ניסוחים כלליים כגון „שהכול יעבור טוב”.",
      order: 2,
      prerequisiteIds: ["general"],
      correctOptionIds: ["paka-goals-correct"],
      options: [
        option(
          "paka-goals-correct",
          "מטרות: א. תרגול עבודת צוות; ב. עמידה בלו״ז; ג. הפעלת תחנות אימון בסדר ובשליטה.",
          "נכון",
          "אלה תוצאות ברורות שהפעילות נועדה להשיג.",
          "",
        ),
        option(
          "paka-goals-method",
          "הצוערים יתחלקו לשלושה צוותים ויעברו בין התחנות.",
          "שייך לשיטה",
          "",
          "המשפט מתאר כיצד הפעילות תבוצע, לא מה רוצים להשיג באמצעותה.",
          "method",
        ),
        option(
          "paka-goals-vague",
          "שהאימון יעבור בצורה טובה ומוצלחת.",
          "עמום",
          "",
          "לא ניתן לבדוק מהי הצלחה. נדרשת תוצאה ממוקדת כגון עבודת צוות או עמידה בלוחות זמנים.",
        ),
      ],
    }),
    section({
      id: "rationale",
      title: "רציונל",
      purpose: "להסביר מדוע המשימה נדרשת ומה ההיגיון שמאחוריה.",
      whatBelongs: "הצורך המקצועי או הארגוני והקשרו למטרה הרחבה.",
      commonMistakes:
        "חזרה על תיאור המשימה בלי להסביר מדוע היא נחוצה.",
      order: 3,
      prerequisiteIds: ["general"],
      correctOptionIds: ["paka-rationale-correct"],
      options: [
        option(
          "paka-rationale-correct",
          "רציונל: הפעילות נועדה לחבר בין תכנון, חלוקת אחריות וביצוע בפועל במסגרת זמן מוגדרת.",
          "נכון",
          "המשפט מסביר את הצורך המקצועי ואת ההיגיון שמאחורי הפעילות.",
          "",
        ),
        option(
          "paka-rationale-repeat",
          "יום האימון הוא פעילות שבה הצוערים עוברים בין שלוש תחנות.",
          "חזרה על התיאור",
          "",
          "זהו תיאור הפעילות, אך הוא אינו מסביר מדוע הפעילות נדרשת.",
        ),
        option(
          "paka-rationale-goal",
          "לעמוד בלוחות הזמנים ולהפעיל את התחנות באופן מסודר.",
          "שייך למטרות",
          "",
          "זהו ניסוח של תוצאה רצויה. ברציונל נדרש להסביר את הצורך הרחב.",
          "goals",
        ),
      ],
    }),
    section({
      id: "method",
      title: "שיטה",
      purpose: "להסביר כיצד תבוצע המשימה בפועל.",
      whatBelongs:
        "חלוקה לשלבים, אופן הביצוע, סדר הפעולות והארגון המרכזי.",
      commonMistakes:
        "חזרה על המטרות או ירידה לפרטים שאמורים להופיע בלו״ז ובתחומי האחריות.",
      order: 4,
      prerequisiteIds: ["goals", "rationale"],
      correctOptionIds: ["paka-method-correct"],
      options: [
        option(
          "paka-method-correct",
          "שיטה: הצוערים יחולקו לשלושה צוותים וינועו בסבב תחנות מתוזמן. לכל תחנה יוגדר אחראי תחנה, נקודת פתיחה וסיום ודיווח למפקד הפעילות.",
          "נכון",
          "הבחירה מתארת כיצד תתבצע הפעילות ואת הארגון המרכזי שלה.",
          "",
        ),
        option(
          "paka-method-goal",
          "מטרת היום היא לשפר עבודת צוות ועמידה בזמנים.",
          "שייך למטרות",
          "",
          "המשפט מתאר תוצאה רצויה, אך אינו מסביר כיצד תבוצע המשימה.",
          "goals",
        ),
        option(
          "paka-method-schedule",
          "07:30 התכנסות, 07:45 תדריך ו־08:00 פתיחת תחנות.",
          "שייך ללו״ז",
          "",
          "אלה נקודות זמן. הן חשובות, אך מקומן בלו״ז העקרוני.",
          "schedule",
        ),
      ],
    }),
    section({
      id: "schedule",
      title: "לו״ז עקרוני",
      purpose: "להגדיר את הרצף הכרונולוגי ואת נקודות הזמן המרכזיות.",
      whatBelongs: "שעת התכנסות, תדריך, שלבי ביצוע, הפסקות וסיום.",
      commonMistakes:
        "זמנים סותרים, חוסר בנקודות מעבר או פירוט שאינו עקרוני.",
      order: 5,
      prerequisiteIds: ["method"],
      correctOptionIds: ["paka-schedule-correct"],
      options: [
        option(
          "paka-schedule-correct",
          "לו״ז עקרוני: 07:30 התייצבות; 07:45 תדריך פתיחה; 08:00 פתיחת תחנות; 12:00 הפסקה; 15:00 סיכום; 15:30 סיום ופיזור.",
          "נכון",
          "מוצג רצף עקרוני ברור מן ההתכנסות ועד הסיום.",
          "",
        ),
        option(
          "paka-schedule-conflict",
          "07:30 פתיחת תחנות; 07:45 תדריך; 15:30 סיום.",
          "סתירה פנימית",
          "",
          "אי אפשר לפתוח את התחנות לפני התדריך המתוכנן. הרצף הכרונולוגי אינו הגיוני.",
        ),
        option(
          "paka-schedule-detail",
          "כל תרגיל בתחנה יכלול הסבר של שבע דקות, ביצוע של 31 דקות ומשוב של שבע דקות.",
          "מפורט מדי",
          "",
          "זהו פירוט ביצועי שאינו נדרש בלו״ז העקרוני.",
          "method",
        ),
      ],
    }),
    section({
      id: "responsibilities",
      title: "תחומי אחריות",
      purpose: "לקבוע מי אחראי לכל משימה, תוצר ובקרה.",
      whatBelongs: "בעל תפקיד מוגדר לצד אחריות ברורה.",
      commonMistakes:
        "ניסוחים כמו „הצוות יטפל” או משימה ללא אחראי.",
      order: 6,
      prerequisiteIds: ["method"],
      correctOptionIds: ["paka-responsibilities-correct"],
      options: [
        option(
          "paka-responsibilities-correct",
          "אחראי לוגיסטיקה: יוודא עד 07:15 הימצאות ותקינות ציוד לכל תחנה וידווח למפקד הפעילות.",
          "נכון",
          "הבחירה מגדירה בעל תפקיד, משימה ומועד.",
          "",
        ),
        option(
          "paka-responsibilities-no-owner",
          "יש לוודא שהציוד יהיה מוכן.",
          "חסר",
          "",
          "לא הוגדר מי אחראי לבדיקת הציוד ומתי הבדיקה מתבצעת.",
        ),
        option(
          "paka-responsibilities-team",
          "הצוות יטפל בכל מה שנדרש לקראת הפעילות.",
          "עמום",
          "",
          "„הצוות” אינו בעל תפקיד מוגדר והמשימה אינה ניתנת לבקרה.",
        ),
      ],
    }),
    section({
      id: "emphasis",
      title: "דגשים",
      purpose:
        "להבליט הוראות חשובות שלא קיבלו מענה מספק בסעיפים האחרים.",
      whatBelongs: "מגבלות, כללים, נקודות בקרה או חריגים חשובים.",
      commonMistakes:
        "העתקה של סעיפים קודמים או רשימה עמוסה של פרטים שוליים.",
      order: 7,
      prerequisiteIds: [
        "goals",
        "rationale",
        "method",
        "schedule",
        "responsibilities",
      ],
      correctOptionIds: ["paka-emphasis-correct"],
      options: [
        option(
          "paka-emphasis-correct",
          "דגשים: שתייה ומעקב חום; דיווח על שינוי בתנאים; עצירת פעילות במקרה תקלה בציוד או ברכב עד אישור מפקד הפעילות.",
          "נכון",
          "אלה הוראות חשובות החוצות את הפעילות ומדגישות חריגים ובקרה.",
          "",
        ),
        option(
          "paka-emphasis-repeat",
          "ההתכנסות תתקיים ב־07:30, התדריך ב־07:45 והתחנות ייפתחו ב־08:00.",
          "חוזר על עצמו",
          "",
          "המידע כבר הוגדר במלואו בלו״ז ואינו מוסיף דגש חדש.",
          "schedule",
        ),
        option(
          "paka-emphasis-minor",
          "רצוי שכל משתתף יביא כלי כתיבה בצבע כחול.",
          "שולי",
          "",
          "זהו פרט שולי שאינו מצדיק הדגשה ברמת הפקודה בתרחיש הזה.",
        ),
      ],
    }),
  ],
  reviewScenarios: [
    {
      id: "paka-review-v1",
      title: "בקרת פקודת הארגון",
      instructions:
        "קראו כל חלק בפקודה, סמנו את ההערות המתאימות או קבעו שהחלק תקין. אין משוב עד להגשת המסמך.",
      annotationBank: pakaAnnotations,
      scoringRules: defaultScoringRules,
      documentBlocks: [
        {
          id: "paka-r-general",
          sectionId: "general",
          label: "כללי",
          content:
            "בתאריך 15.7, בשעות 07:30–15:30, יתקיים יום אימון צוותי בהשתתפות 24 צוערים בשלושה צוותים.",
          expectedAnnotations: ["paka-missing"],
          explanation:
            "מקום הפעילות חסר. בלעדיו לא ניתן להבין היכן יש להתייצב ולהיערך.",
          isCorrect: false,
        },
        {
          id: "paka-r-goals",
          sectionId: "goals",
          label: "מטרות",
          content:
            "מטרות: הצוערים יחולקו לשלושה צוותים וינועו בסבב בין שלוש תחנות.",
          expectedAnnotations: ["paka-wrong-section"],
          explanation:
            "זהו תיאור של שיטת הביצוע. מטרות צריכות לתאר את התוצאות הרצויות.",
          isCorrect: false,
        },
        {
          id: "paka-r-rationale",
          sectionId: "rationale",
          label: "רציונל",
          content: "רציונל: נדרש לקיים יום אימון צוותי משום שזהו יום אימון צוותי.",
          expectedAnnotations: ["paka-vague", "paka-redundant"],
          explanation:
            "הניסוח חוזר על שם הפעילות ואינו מסביר את הצורך המקצועי שמאחוריה.",
          isCorrect: false,
        },
        {
          id: "paka-r-method",
          sectionId: "method",
          label: "שיטה",
          content:
            "שיטה: הצוערים יחולקו לשלושה צוותים. בכל תחנה יתקיים תרגיל בן 45 דקות.",
          expectedAnnotations: ["paka-missing"],
          explanation:
            "חסרה דרך המעבר והסבב בין התחנות, ולכן אופן הביצוע אינו שלם.",
          isCorrect: false,
        },
        {
          id: "paka-r-method-ok",
          sectionId: "method",
          label: "ארגון התחנות",
          content:
            "לכל תחנה יוגדר אחראי תחנה שיקבל את הצוות, יבצע תדריך קצר ויאשר סיום ביצוע למפקד הפעילות.",
          expectedAnnotations: [],
          explanation:
            "החלק תקין: הוא מגדיר עיקרון ביצועי ברור שמתאים לסעיף השיטה.",
          isCorrect: true,
        },
        {
          id: "paka-r-schedule",
          sectionId: "schedule",
          label: "לו״ז עקרוני",
          content:
            "לו״ז עקרוני: 07:30 פתיחת התחנות; 07:45 תדריך; 12:00 הפסקה; 15:30 סיום.",
          expectedAnnotations: ["paka-contradiction"],
          explanation:
            "פתיחת התחנות מופיעה לפני התדריך ולכן הרצף הפנימי סותר.",
          isCorrect: false,
        },
        {
          id: "paka-r-responsibility",
          sectionId: "responsibilities",
          label: "תחומי אחריות",
          content: "תחומי אחריות: יש לוודא שהציוד לכל תחנה קיים ותקין לפני הפעילות.",
          expectedAnnotations: ["paka-no-owner", "paka-no-deadline"],
          explanation:
            "המשימה נדרשת, אך לא נקבע בעל תפקיד ולא נקבע מועד שמאפשר בקרה.",
          isCorrect: false,
        },
        {
          id: "paka-r-emphasis",
          sectionId: "emphasis",
          label: "דגשים",
          content:
            "דגשים: התייצבות ב־07:30, תדריך ב־07:45, הפסקה ב־12:00 וסיום ב־15:30.",
          expectedAnnotations: ["paka-redundant"],
          explanation:
            "הדגש משכפל את הלו״ז ואינו מוסיף מגבלה, חריג או נקודת בקרה.",
          isCorrect: false,
        },
        {
          id: "paka-r-emphasis-ok",
          sectionId: "emphasis",
          label: "דגש מזג אוויר",
          content:
            "דגש מזג אוויר: בשל עומס חום יש להקפיד על שתייה, מעקב מצב משתתפים ודיווח מיידי למפקד הפעילות על שינוי חריג.",
          expectedAnnotations: [],
          explanation:
            "החלק תקין: הוא מדגיש מגבלה חשובה ודרך דיווח שאינן חזרה על סעיף אחר.",
          isCorrect: true,
        },
      ],
    },
  ],
  summaryPoints: [
    "פק״א טובה מאפשרת להבין מה צריך לקרות, מתי, כיצד ובאחריות מי.",
    "מטרות מתארות תוצאות; שיטה מתארת את אופן הביצוע.",
    "אחריות שאינה משויכת לבעל תפקיד ולמועד אינה ניתנת לבקרה.",
  ],
};

const risk: ModuleContent = {
  id: "risk",
  number: 2,
  title: "ניהול סיכונים",
  eyebrow: "איתור · הערכה · מענה · בקרה",
  shortDescription:
    "מאתרים סכנות וסיכונים, מעריכים אותם, קובעים מענה, אחריות ובקרה.",
  transitionIn:
    "המשימה כבר ברורה. כעת בוחנים באופן שיטתי מה עלול לפגוע בביצועה.",
  transitionOut:
    "לאחר שהמשימה בוצעה, צריך להשוות בין המתוכנן לבין מה שקרה בפועל, להבין את הסיבות לפער ולהפיק לקחים להמשך.",
  documentName: "טבלת ניהול סיכונים — יום אימון צוותי",
  example: {
    title: "דוגמת טבלת ניהול סיכונים",
    caption:
      "דוגמה מתוך חומרי הלמידה: טבלת סיכונים צבאית עם חלוקת M5, הערכה ראשונית, פעילות מתקנת, אחריות, סיכון שיורי ובקרה.",
    imageSrc: "/examples/risk-example.png",
    sourceLabel: "מתוך חומרי ניהול סיכונים",
  },
  intro: {
    what:
      "ניהול סיכונים הוא כלי לאיתור נקודות תורפה וכשלים אפשריים, לניתוחם באופן מובנה ולמתן מענה מראש.",
    why:
      "כדי לזהות מה עלול להשתבש, להעריך את חומרת הפגיעה והסבירות, ולבחור פעולה שמפחיתה את הסיכון.",
    when:
      "לקראת פעילות או משימה חדשה, וגם כאשר משתנים מקום, שיטה, אמצעים, כוח אדם או תנאי הסביבה.",
    who:
      "המפקד, בעלי התפקידים והגורמים המקצועיים שמכירים את המשימה, האמצעים והסביבה.",
    enables:
      "התהליך מאפשר קבלת החלטה, קביעת פעולה מתקנת, אחראי, מועד ובקרה. זהו תהליך מתמשך ולא מסמך חד־פעמי.",
    connection:
      "הפק״א הגדירה את המשימה. ניהול הסיכונים בוחן מה עלול לפגוע בה. לאחר הביצוע התחקיר יבחן מה קרה בפועל.",
    highlights: [
      {
        term: "סכנה",
        definition: "מצב, מקור או גורם שיש בו פוטנציאל לנזק.",
      },
      {
        term: "סיכון",
        definition: "האפשרות שהנזק הפוטנציאלי יתממש.",
      },
      {
        term: "M5",
        definition:
          "Mission, Management, Medium, Machine, Man — חמש זוויות לסריקת גורמי סיכון.",
      },
    ],
  },
  documentSections: [
    section({
      id: "stage",
      title: "שלב במשימה",
      purpose: "למקם את גורם הסיכון בשלב המבצעי שבו הוא רלוונטי.",
      whatBelongs:
        "השלב במשימה שבו מתקיים גורם הסיכון, למשל: לפני יציאה, במהלך תנועה או בפעילות עצמה.",
      commonMistakes: "ניסוח כללי שאינו ממקם את הסיכון בשלב מסוים.",
      order: 1,
      prerequisiteIds: [],
      correctOptionIds: ["risk-stage-before"],
      options: [
        option(
          "risk-stage-before",
          "לפני יציאה",
          "נכון",
          "כשירות הרכב נבחנת בשלב ההכנה שלפני היציאה, ולכן זהו השלב הרלוונטי.",
          "",
        ),
        option(
          "risk-stage-during",
          "במהלך הפעילות בתחנות",
          "שלב לא מתאים",
          "",
          "הסיכון בכשירות הרכב מתקיים לפני התנועה, לא בתחנות עצמן.",
        ),
        option(
          "risk-stage-end",
          "בסיום היום ובפיזור",
          "שלב לא מתאים",
          "",
          "שלב הפיזור מאוחר מדי; הסיכון רלוונטי לשלב ההכנה והתנועה.",
        ),
      ],
    }),
    section({
      id: "m5",
      title: "גורם / תחום M5",
      purpose: "לזהות באיזה תחום נמצא מקור הסיכון.",
      whatBelongs:
        "Man — אדם; Machine — ציוד ואמל״ח; Medium — סביבה; Management — פיקוד ושליטה.",
      commonMistakes: "בחירת תחום לפי התוצאה במקום לפי מקור הסיכון.",
      order: 2,
      prerequisiteIds: ["stage"],
      correctOptionIds: ["risk-m5-machine"],
      options: [
        option(
          "risk-m5-machine",
          "Machine – ציוד ואמצעים: רכב תובלה טרם אושר בבדיקת כשירות לפני יציאה.",
          "נכון",
          "המקור נמצא בכשירות של ציוד ואמצעים.",
          "",
        ),
        option(
          "risk-m5-medium",
          "Medium — סביבה: רכב תובלה טרם אושר בבדיקת כשירות לפני יציאה.",
          "תחום לא מתאים",
          "",
          "Medium עוסק במזג אוויר, שטח ותנאים חיצוניים. כשירות רכב שייכת ל־Machine.",
        ),
        option(
          "risk-m5-management",
          "Management — פיקוד ושליטה: רכב תובלה טרם אושר בבדיקת כשירות לפני יציאה.",
          "תחום לא מתאים",
          "",
          "ייתכן היבט ניהולי, אך מקור הסיכון המתואר הוא האמצעי עצמו ולכן הסריקה מתחילה ב־Machine.",
        ),
      ],
    }),
    section({
      id: "hazard",
      title: "סכנה",
      purpose: "להגדיר את המצב או המקור בעל פוטנציאל הנזק.",
      whatBelongs: "הגורם הקיים לפני שהתממש נזק.",
      commonMistakes: "ניסוח תוצאה עתידית במקום מצב מסוכן.",
      order: 3,
      prerequisiteIds: ["m5"],
      correctOptionIds: ["risk-hazard-correct"],
      options: [
        option(
          "risk-hazard-correct",
          "רכב תובלה ללא אישור כשירות לפני יציאה.",
          "נכון",
          "זהו מצב קיים בעל פוטנציאל לנזק.",
          "",
        ),
        option(
          "risk-hazard-event",
          "הרכב ייתקע במהלך התנועה ויעכב את הפעילות.",
          "זהו סיכון",
          "",
          "המשפט מתאר אירוע עתידי ותוצאה ולכן הוא שייך לסיכון, לא לסכנה.",
          "risk-statement",
        ),
        option(
          "risk-hazard-vague",
          "רכב.",
          "עמום",
          "",
          "שם האמצעי לבדו אינו מגדיר מהו המצב בעל פוטנציאל הנזק.",
        ),
      ],
    }),
    section({
      id: "risk-statement",
      title: "סיכון",
      purpose: "להגדיר מה עלול לקרות ומה הנזק האפשרי.",
      whatBelongs:
        "ניסוח מומלץ: „בגלל ___ עלול להתרחש ___ ולגרום ל־___”.",
      commonMistakes: "שם קצר של גורם בלי תרחיש התממשות ותוצאה.",
      order: 4,
      prerequisiteIds: ["hazard"],
      correctOptionIds: ["risk-statement-correct"],
      options: [
        option(
          "risk-statement-correct",
          "בשל יציאה עם רכב שלא אושר כשיר, עלולה להתרחש תקלה במהלך תנועה ולגרום לעיכוב בלו״ז או לפגיעה בבטיחות המשתתפים.",
          "נכון",
          "הניסוח כולל גורם, אירוע אפשרי ותוצאה.",
          "",
        ),
        option(
          "risk-statement-car",
          "רכב.",
          "אינו תרחיש",
          "",
          "זהו שם של אמצעי, לא תרחיש שמסביר מה עלול לקרות ומה הנזק.",
        ),
        option(
          "risk-statement-hazard",
          "רכב שלא נבדקה כשירותו.",
          "זו סכנה",
          "",
          "המשפט מתאר מצב קיים. כדי לנסח סיכון צריך להוסיף מה עלול לקרות ולמה יגרום.",
          "hazard",
        ),
      ],
    }),
    section({
      id: "severity",
      title: "חומרה",
      purpose: "להעריך מה תהיה חומרת התוצאה אם הסיכון יתממש.",
      whatBelongs: "דרגת חומרה מנומקת: חמור A, בינוני B או קל C.",
      commonMistakes: "בחירת דרגה ללא קשר לתוצאה האפשרית.",
      order: 5,
      prerequisiteIds: ["risk-statement"],
      correctOptionIds: ["risk-severity-a"],
      options: [
        option(
          "risk-severity-a",
          "A — חמור: תקלה בתנועה עלולה לפגוע במשימה או במשתתפים.",
          "נכון",
          "החומרה מתייחסת לתוצאה האפשרית, לא לסיכוי שהיא תקרה.",
          "",
        ),
        option(
          "risk-severity-c",
          "C — קל: אין השפעה ממשית על הפעילות.",
          "נמוכה מדי",
          "",
          "תקלה ברכב במהלך תנועה יכולה להשפיע באופן משמעותי ולכן דרגה קלה אינה מתאימה.",
        ),
        option(
          "risk-severity-a-noreason",
          "A — חמור בכל מקרה, משום שמדובר ברכב.",
          "ללא הנמקה",
          "",
          "אין לקבוע חומרה רק לפי שם האמצעי. נדרש להתייחס לתוצאה בתרחיש הנתון.",
        ),
      ],
    }),
    section({
      id: "likelihood",
      title: "סבירות",
      purpose: "להעריך את הסיכוי שהסיכון יתממש בתנאים הנתונים.",
      whatBelongs: "דרגת סבירות מנומקת: זניחה, נמוכה, בינונית או גבוהה.",
      commonMistakes: "בלבול בין גודל הנזק לבין הסיכוי להתממשות.",
      order: 6,
      prerequisiteIds: ["risk-statement"],
      correctOptionIds: ["risk-likelihood-binonit"],
      options: [
        option(
          "risk-likelihood-binonit",
          "בינונית: הרכב טרם נבדק ולכן קיימת אי־ודאות ממשית לגבי כשירותו.",
          "נכון",
          "הסבירות מבוססת על התנאים הקיימים ועל כך שהבדיקה טרם בוצעה.",
          "",
        ),
        option(
          "risk-likelihood-znicha",
          "זניחה: כלי רכב בדרך כלל פועלים.",
          "נמוכה מדי",
          "",
          "ההערכה מתעלמת מן הנתון המרכזי: בדיקת הכשירות טרם הושלמה.",
        ),
        option(
          "risk-likelihood-gvoha",
          "גבוהה: כל רכב שלא נבדק בהכרח יתקלקל.",
          "גבוהה מדי",
          "",
          "אי־בדיקה אינה מוכיחה שהתקלה כמעט ודאית. יש להעריך את הסיכוי בתנאים הנתונים.",
        ),
      ],
    }),
    section({
      id: "initial-level",
      title: "רמת סיכון ראשונית",
      purpose: "לגזור את רמת הסיכון מן החומרה והסבירות לפי המטריצה.",
      whatBelongs: "ערך מתוך מטריצת הסיכון לפי הדרגות שנבחרו.",
      commonMistakes: "בחירת ערך שאינו תואם למשבצת במטריצה.",
      order: 7,
      prerequisiteIds: ["severity", "likelihood"],
      correctOptionIds: ["risk-initial-9"],
      options: [
        option(
          "risk-initial-9",
          "9 — גבוה (חמור A × סבירות בינונית).",
          "נכון",
          "במטריצה, חמור A מול סבירות בינונית נותן 9 — רמת סיכון גבוהה.",
          "",
        ),
        option(
          "risk-initial-4",
          "4 — נמוך.",
          "ערך שגוי",
          "",
          "הערך 4 במטריצה מתאים לקל C מול סבירות בינונית, לא לדרגות שנבחרו.",
        ),
        option(
          "risk-initial-5",
          "5 — בינוני.",
          "ערך שגוי",
          "",
          "הערך 5 מתאים לקל C מול סבירות גבוהה. יש לקרוא את הערך מהמשבצת הנכונה.",
        ),
      ],
    }),
    section({
      id: "mitigation",
      title: "פעילות מתקנת",
      purpose: "לקבוע מה משנים או מוסיפים כדי להפחית את הסיכון.",
      whatBelongs: "פעולה שמטפלת בגורם הסיכון באופן ישיר.",
      commonMistakes: "הנחיה כללית שאינה משנה את התנאים.",
      order: 8,
      prerequisiteIds: ["initial-level"],
      correctOptionIds: ["risk-mitigation-correct"],
      options: [
        option(
          "risk-mitigation-correct",
          "פעילות מתקנת: ביצוע בדיקת כשירות מלאה לפני יציאה, אישור מפקד פעילות והעמדת רכב חלופי זמין.",
          "נכון",
          "הפעולה מטפלת בגורם ומפחיתה את הסבירות לתקלה ולעיכוב.",
          "",
        ),
        option(
          "risk-mitigation-careful",
          "להזכיר לכולם להיות זהירים.",
          "חלש מדי",
          "",
          "זהירות כללית אינה מטפלת בכשירות הרכב ואינה משנה את מקור הסיכון.",
        ),
        option(
          "risk-mitigation-stop",
          "לבטל מיד את כל יום האימון בלי לבצע בדיקה.",
          "אינו מידתי",
          "",
          "לפני ביטול המשימה יש לבחון מענה שמטפל בגורם, כגון בדיקה וחלופה.",
        ),
      ],
    }),
    section({
      id: "owner-deadline",
      title: "אחראי ומועד",
      purpose: "לקבוע מי מבצע את הפעולה ועד מתי.",
      whatBelongs: "בעל תפקיד, פעולה, זמן השלמה ודיווח.",
      commonMistakes: "„כולם” כאחראי או היעדר מועד.",
      order: 9,
      prerequisiteIds: ["mitigation"],
      correctOptionIds: ["risk-owner-correct"],
      options: [
        option(
          "risk-owner-correct",
          "אחראי רכב: ישלים בדיקה עד 07:00 וידווח למפקד הפעילות; מפקד הפעילות יאשר יציאה.",
          "נכון",
          "מוגדרים אחראי, פעולה, מועד ודיווח.",
          "",
        ),
        option(
          "risk-owner-everyone",
          "כולם אחראים לבדוק שהרכב תקין.",
          "אחריות עמומה",
          "",
          "כאשר כולם אחראים, אין בעל תפקיד שניתן לוודא מולו השלמה.",
        ),
        option(
          "risk-owner-no-time",
          "אחראי הרכב יבצע בדיקה לפני הפעילות.",
          "חסר מועד",
          "",
          "„לפני הפעילות” אינו מגדיר נקודת זמן שמאפשרת תגובה אם מתגלה תקלה.",
        ),
      ],
    }),
    section({
      id: "residual",
      title: "סיכון שיורי",
      purpose: "להעריך מחדש את הסיכון לאחר המענה.",
      whatBelongs: "ערך מעודכן מהמטריצה בהתאם להשפעת הפעולה המתקנת.",
      commonMistakes: "השארת הרמה המקורית בלי לבדוק מה השתנה.",
      order: 10,
      prerequisiteIds: ["mitigation", "owner-deadline"],
      correctOptionIds: ["risk-residual-3"],
      options: [
        option(
          "risk-residual-3",
          "3 — נמוך (חמור A × סבירות זניחה): לאחר בדיקה וחלופה הסבירות יורדת לזניחה.",
          "נכון",
          "הפעולה מפחיתה את הסבירות; אם התקלה תתרחש חומרתה עדיין משמעותית.",
          "",
        ),
        option(
          "risk-residual-9",
          "9 — גבוה: אין צורך לשנות את ההערכה לאחר המענה.",
          "לא הוערך מחדש",
          "",
          "סיכון שיורי מחייב הערכה מחדש לאחר הפעילות המתקנת.",
        ),
        option(
          "risk-residual-zero",
          "0 — אין עוד סיכון.",
          "ביטול מלאכותי",
          "",
          "מענה מפחית סיכון אך אינו בהכרח מבטל אותו לחלוטין.",
        ),
      ],
    }),
    section({
      id: "monitoring",
      title: "בקרה ועדכון",
      purpose: "לקבוע כיצד בודקים שהפעולה בוצעה ומתי מעדכנים.",
      whatBelongs: "מנגנון דיווח, נקודת בקרה ותנאי להערכה מחדש.",
      commonMistakes: "הסתפקות בהוראה בלי לבדוק שבוצעה.",
      order: 11,
      prerequisiteIds: ["residual"],
      correctOptionIds: ["risk-monitoring-correct"],
      options: [
        option(
          "risk-monitoring-correct",
          "בקרה ועדכון: מפקד הפעילות יוודא קבלת דיווח כשירות עד 07:00, יאשר חלופה ויעדכן הערכת סיכון בכל שינוי בתנאי רכב/מזג אוויר.",
          "נכון",
          "מוגדרים דיווח, נקודת בקרה ותנאי לעדכון ההערכה.",
          "",
        ),
        option(
          "risk-monitoring-assume",
          "לאחר שניתנה הוראה לבדיקה ניתן להניח שהנושא טופל.",
          "חסרה בקרה",
          "",
          "הוראה אינה הוכחת ביצוע. נדרש מנגנון שמוודא השלמה ומעדכן על שינוי.",
        ),
        option(
          "risk-monitoring-end",
          "לבדוק בסוף היום אם הרכב היה תקין.",
          "מאוחר מדי",
          "",
          "הבקרה צריכה לאפשר החלטה לפני התנועה ולא רק לאחר סיום הפעילות.",
        ),
      ],
    }),
  ],
  reviewScenarios: [
    {
      id: "risk-review-v1",
      title: "בקרת טבלת ניהול הסיכונים",
      instructions:
        "כל כרטיס מייצג שורה או חלק בטבלה. סמנו את כל ההערות המתאימות, או קבעו שהשורה תקינה.",
      annotationBank: riskAnnotations,
      scoringRules: defaultScoringRules,
      documentBlocks: [
        {
          id: "risk-r-weather",
          sectionId: "risk-statement",
          label: "Medium — מזג אוויר",
          content:
            "תחום M5: Medium. סכנה: מזג אוויר. סיכון: מזג אוויר. חומרה 3, סבירות 3, רמה ראשונית 9.",
          expectedAnnotations: [
            "risk-danger-confusion",
            "risk-not-scenario",
          ],
          explanation:
            "מזג האוויר הוא גורם או סכנה. הסיכון צריך לתאר מה עלול לקרות ומה הנזק.",
          isCorrect: false,
        },
        {
          id: "risk-r-m5",
          sectionId: "m5",
          label: "Man — רכב",
          content:
            "תחום M5: Man. סכנה: רכב תובלה ללא אישור כשירות לפני יציאה.",
          expectedAnnotations: ["risk-wrong-m5"],
          explanation:
            "כשירות רכב שייכת ל־Machine — ציוד ואמצעים, לא ל־Man — אדם.",
          isCorrect: false,
        },
        {
          id: "risk-r-level",
          sectionId: "initial-level",
          label: "חישוב רמה ראשונית",
          content:
            "הערכת סיכון ראשונית: חומרה 4, סבירות 3, רמת סיכון ראשונית 4 — נמוך.",
          expectedAnnotations: ["risk-level"],
          explanation:
            "4 × 3 = 12, ועל פי המטריצה הרמה היא גבוהה.",
          isCorrect: false,
        },
        {
          id: "risk-r-mitigation",
          sectionId: "mitigation",
          label: "פעילות מתקנת",
          content:
            "סיכון: בשל רכב שלא אושר כשיר עלולה להתרחש תקלה במהלך התנועה. פעילות מתקנת: להזכיר לכלל המשתתפים להיות זהירים.",
          expectedAnnotations: ["risk-weak-control"],
          explanation:
            "הפעולה אינה מטפלת בכשירות הרכב. נדרשת בדיקה וחלופה.",
          isCorrect: false,
        },
        {
          id: "risk-r-owner",
          sectionId: "owner-deadline",
          label: "אחראי ומועד",
          content:
            "אחראי ומועד: כלל בעלי התפקידים יבצעו בדיקת רכב מתישהו לפני היציאה.",
          expectedAnnotations: ["risk-no-owner", "risk-no-deadline"],
          explanation:
            "„כולם” אינו אחראי מוגדר ו„מתישהו” אינו מועד שניתן לבקרה.",
          isCorrect: false,
        },
        {
          id: "risk-r-residual",
          sectionId: "residual",
          label: "לאחר הפעילות המתקנת",
          content:
            "לאחר הפעילות המתקנת: בוצעה בדיקת כשירות ונקבע רכב חלופי. רמת הסיכון הראשונית נותרת 12.",
          expectedAnnotations: ["risk-no-residual"],
          explanation:
            "לא הוערך הסיכון מחדש לאחר המענה ולכן חסר סיכון שיורי.",
          isCorrect: false,
        },
        {
          id: "risk-r-monitoring",
          sectionId: "monitoring",
          label: "בקרה",
          content:
            "בקרה: אחראי הרכב הונחה להשלים בדיקה עד 07:00. לא נדרש דיווח נוסף למפקד הפעילות.",
          expectedAnnotations: ["risk-no-monitoring"],
          explanation:
            "חסרה בדיקה שהפעולה בוצעה ודרך לעדכן אם התנאים משתנים.",
          isCorrect: false,
        },
        {
          id: "risk-r-heat-ok",
          sectionId: "mitigation",
          label: "Medium — עומס חום",
          content:
            "תחום M5: Medium. בשל עומס חום משתתף עלול להיפגע. הפעילות תוקדם, יוגדרו הפסקות שתייה ואחראי צוות יבצע בקרה בכל מעבר.",
          expectedAnnotations: [],
          explanation:
            "השורה תקינה: הסיכון מנוסח כתרחיש, המענה מתאים וקיימת בקרה.",
          isCorrect: true,
        },
        {
          id: "risk-r-vehicle-ok",
          sectionId: "monitoring",
          label: "Machine — כשירות רכב",
          content:
            "תחום M5: Machine. אחראי הרכב ישלים בדיקה עד 07:00, ידווח למפקד הפעילות ויוודא חלופה זמינה. לאחר המענה: חומרה 4, סבירות 1, רמה 4.",
          expectedAnnotations: [],
          explanation:
            "השורה תקינה: יש אחראי, מועד, דיווח והערכת סיכון שיורי.",
          isCorrect: true,
        },
      ],
    },
  ],
  summaryPoints: [
    "סכנה היא מקור פוטנציאלי לנזק; סיכון הוא תרחיש התממשות ותוצאה.",
    "מענה טוב מטפל בגורם, מגדיר אחראי ומועד ומלווה בבקרה.",
    "לאחר המענה מעריכים מחדש את הסיכון — זהו הסיכון השיורי.",
  ],
};

const debrief: ModuleContent = {
  id: "debrief",
  number: 3,
  title: "תחקיר",
  eyebrow: "עובדות · פערים · מסקנות · לקחים",
  shortDescription:
    "מבררים מה היה, מדוע קרה ומה יש לעשות אחרת או לשמר במשימה הבאה.",
  transitionIn:
    "המשימה בוצעה. כעת משווים בין המתוכנן לבין מה שקרה בפועל ולומדים לקראת הפעם הבאה.",
  transitionOut:
    "הרצף נסגר — הלקחים מן התחקיר חוזרים אל התכנון, האחריות וניהול הסיכונים במשימה הבאה.",
  documentName: "דוח תחקיר — יום אימון צוותי",
  example: {
    title: "דוגמת דוח תחקיר",
    caption:
      "דוגמה מתוך חומרי הלמידה: דוח תחקיר במבנה צבאי, עם כללי, ממצאים, מסקנות, לקחים, המלצות וסיכום.",
    imageSrc: "/examples/debrief-example.png",
    sourceLabel: "מתוך חומרי תחקיר",
  },
  intro: {
    what:
      "התחקיר הוא כלי מקצועי של המפקד ללמידה ולהשתפרות. הוא מברר אירוע או תהליך ומשווה בין הביצוע לבין המצופה.",
    why:
      "כדי להבין את הסיבות לפער ולהפיק לקחים שישפרו את הפעילות העתידית.",
    when:
      "תחקיר ראשוני מבוצע סמוך לאירוע. בנושאים רחבים או מתמשכים ניתן לבצע גם תחקיר חוזר.",
    who:
      "המפקד, המתחקר ובעלי התפקידים הרלוונטיים שמכירים את העובדות ואת הביצוע.",
    enables:
      "התחקיר מאפשר לברר מה היה, למה זה קרה ומה נעשה אחרת או נשמר בפעם הבאה. הוא אינו חיפוש אשמים ואינו כלי ענישה.",
    connection:
      "התחקיר בוחן את הפער בין הפק״א והסיכונים שתוכננו לבין הביצוע בפועל, ומחזיר לקחים אל המשימה הבאה.",
    highlights: [
      {
        term: "עובדה",
        definition: "מידע שניתן לבסס: שעה, פעולה, מסמך, תוצאה או עדות מאומתת.",
      },
      {
        term: "מסקנה",
        definition: "הסבר מדוע נוצר הפער, על בסיס הממצאים.",
      },
      {
        term: "לקח",
        definition: "החלטה מה לעשות אחרת, לתקן או לשמר בעתיד ובתחום הסמכות.",
      },
      {
        term: "המלצה",
        definition: "הצעה לפעולה נדרשת שאינה בסמכות המתחקר.",
      },
    ],
  },
  documentSections: [
    section({
      id: "event-date",
      title: "מועד האירוע",
      purpose: "לציין מתי התרחש האירוע שמתוחקר.",
      whatBelongs: "תאריך מלא ושעה.",
      commonMistakes: "מועד כללי או יחסי ללא תאריך ושעה מדויקים.",
      order: 1,
      prerequisiteIds: [],
      correctOptionIds: ["debrief-date-correct"],
      options: [
        option(
          "debrief-date-correct",
          "15.7 בשעה 07:30",
          "נכון",
          "מועד מלא: תאריך ושעה מדויקים.",
          "",
        ),
        option(
          "debrief-date-month",
          "במהלך חודש יולי",
          "כללי מדי",
          "",
          "חסרים תאריך מדויק ושעה שניתן לתחקר לפיהם.",
        ),
        option(
          "debrief-date-relative",
          "אחרי ארוחת הבוקר",
          "לא מדויק",
          "",
          "נדרשת נקודת זמן מדויקת ולא תיאור יחסי.",
        ),
      ],
    }),
    section({
      id: "event-place",
      title: "מקום האירוע",
      purpose: "לציין היכן התרחש האירוע.",
      whatBelongs: "מקום מוגדר וברור.",
      commonMistakes: "מיקום כללי שאינו מאפשר למקם את האירוע.",
      order: 2,
      prerequisiteIds: ["event-date"],
      correctOptionIds: ["debrief-place-correct"],
      options: [
        option(
          "debrief-place-correct",
          "מתחם ההכשרות — תחנה ב׳",
          "נכון",
          "מקום מוגדר שניתן לזהות במדויק.",
          "",
        ),
        option(
          "debrief-place-base",
          "אי שם בבסיס",
          "כללי מדי",
          "",
          "נדרש מיקום מדויק בתוך הבסיס.",
        ),
        option(
          "debrief-place-vague",
          "ליד התחנות",
          "עמום",
          "",
          "אין מיקום ברור שניתן להתייחס אליו.",
        ),
      ],
    }),
    section({
      id: "general",
      title: "תיאור האירוע",
      purpose: "לתאר בקצרה את מוקד האירוע ללא פרשנות.",
      whatBelongs: "תיאור עובדתי קצר של מה שאירע.",
      commonMistakes: "האשמה, הערכת אופי או פעולה עתידית.",
      order: 3,
      prerequisiteIds: ["event-place"],
      correctOptionIds: ["debrief-general-correct"],
      options: [
        option(
          "debrief-general-correct",
          "עיכוב בפתיחת תחנה ב׳ וחוסר בפריט ציוד נדרש במהלך יום אימון צוותי.",
          "נכון",
          "תיאור ענייני של מוקד האירוע, ללא פרשנות.",
          "",
        ),
        option(
          "debrief-general-blame",
          "האימון נכשל משום שחלק מבעלי התפקידים לא היו רציניים.",
          "פרשנות והאשמה",
          "",
          "זהו שיפוט שאינו מבוסס כעובדה. התיאור צריך להיות עובדתי וללא האשמה.",
        ),
        option(
          "debrief-general-lesson",
          "בפעילות הבאה יש לשבץ אחראי ציוד עד 30 דקות לפני הפתיחה.",
          "שייך ללקחים",
          "",
          "זו פעולה עתידית ולכן מקומה בסעיף לקחים.",
          "lessons",
        ),
      ],
    }),
    section({
      id: "event-results",
      title: "תוצאות האירוע",
      purpose: "לציין מה היו התוצאות העובדתיות של האירוע.",
      whatBelongs: "תוצאה מדידה הניתנת לבדיקה.",
      commonMistakes: "ניסוח עמום או האשמה במקום תוצאה.",
      order: 4,
      prerequisiteIds: ["general"],
      correctOptionIds: ["debrief-results-correct"],
      options: [
        option(
          "debrief-results-correct",
          "עיכוב של 15 דקות בפתיחת תחנה ב׳; לא נפגעו אנשים והפעילות הושלמה.",
          "נכון",
          "תוצאה עובדתית ומדידה.",
          "",
        ),
        option(
          "debrief-results-vague",
          "היה קצת בלגן בהתחלה.",
          "עמום",
          "",
          "אין כאן תוצאה מדידה שניתן לתחקר.",
        ),
        option(
          "debrief-results-blame",
          "התוצאה הייתה באשמת אחראי התחנה.",
          "האשמה",
          "",
          "תוצאה אינה מקום להאשמה אלא לעובדות.",
        ),
      ],
    }),
    section({
      id: "participants",
      title: "משתתפים בתחקיר",
      purpose: "לציין מי השתתף בתחקיר ובאיזה תפקיד.",
      whatBelongs: "רשימת בעלי תפקידים, כולל המתחקר הראשי.",
      commonMistakes: "ניסוח כללי ללא תפקידים.",
      order: 5,
      prerequisiteIds: ["event-results"],
      correctOptionIds: ["debrief-participants-correct"],
      options: [
        option(
          "debrief-participants-correct",
          "מפקד הפעילות — מתחקר ראשי; אחראי הלוגיסטיקה; אחראי תחנה ב׳.",
          "נכון",
          "רשימה עם תפקידים ברורים והמתחקר הראשי.",
          "",
        ),
        option(
          "debrief-participants-all",
          "כולם השתתפו.",
          "עמום",
          "",
          "נדרשת רשימה של בעלי התפקידים הרלוונטיים ותפקידיהם.",
        ),
        option(
          "debrief-participants-one",
          "המתחקר בלבד.",
          "חסר",
          "",
          "יש לכלול את בעלי התפקידים הרלוונטיים לאירוע.",
        ),
      ],
    }),
    section({
      id: "background",
      title: "ממצאי רקע",
      purpose: "להציג את הרקע העובדתי שממסגר את האירוע.",
      whatBelongs: "עובדות רקע על תכנון הפעילות והמסגרת.",
      commonMistakes: "פרשנות או הערכה במקום רקע עובדתי.",
      order: 6,
      prerequisiteIds: ["participants"],
      correctOptionIds: ["debrief-background-correct"],
      options: [
        option(
          "debrief-background-correct",
          "יום האימון תוכנן לשלוש תחנות בסבב מתוזמן, עם אחראי לכל תחנה ולו״ז פתיחה מאושר.",
          "נכון",
          "רקע עובדתי שממסגר את האירוע ומאפשר להבין את הפער.",
          "",
        ),
        option(
          "debrief-background-opinion",
          "האימון לא היה מאורגן מספיק מלכתחילה.",
          "פרשנות",
          "",
          "רקע צריך להיות עובדתי ולא הערכה כללית.",
        ),
        option(
          "debrief-background-lesson",
          "צריך לתכנן את התחנות טוב יותר בפעם הבאה.",
          "שייך ללקחים",
          "",
          "זו פעולה עתידית ולכן מקומה בלקחים.",
          "lessons",
        ),
      ],
    }),
    section({
      id: "findings",
      title: "רצף כרונולוגי",
      purpose: "לתאר את רצף ההתרחשות העובדתי לפי זמנים.",
      whatBelongs: "רצף כרונולוגי, זמנים, פעולות ותוצאות שניתן לבסס.",
      commonMistakes: "ערבוב עובדות עם הערכות או מידע שאינו מאומת.",
      order: 7,
      prerequisiteIds: ["background"],
      correctOptionIds: ["debrief-findings-correct"],
      options: [
        option(
          "debrief-findings-correct",
          "תחנה ב׳ תוכננה להיפתח בשעה 10:00 ונפתחה בפועל בשעה 10:15; בעת המעבר זוהה חוסר בפריט ציוד נדרש.",
          "נכון",
          "אלה נתונים עובדתיים שמאפשרים לשחזר את הרצף ולהשוות בין המצופה לביצוע.",
          "",
        ),
        option(
          "debrief-findings-interpretation",
          "אחראי התחנה לא היה מקצועי ולכן הכול התעכב.",
          "פרשנות",
          "",
          "לא ניתן לבסס הערכת אופי כעובדה. יש לתאר פעולות, זמנים ותוצאות.",
        ),
        option(
          "debrief-findings-no-time",
          "התחנה השנייה התחילה באיחור מסוים.",
          "חסר מידע",
          "",
          "חסרים הזמן המתוכנן והזמן בפועל, ולכן לא ניתן להגדיר את גודל הפער.",
        ),
      ],
    }),
    section({
      id: "additional-findings",
      title: "ממצאים נוספים",
      purpose: "להוסיף ממצאים עובדתיים רלוונטיים שלא נכללו ברצף.",
      whatBelongs: "עובדה נוספת מוגדרת הרלוונטית לפער.",
      commonMistakes: "השערה או ממצא עמום.",
      order: 8,
      prerequisiteIds: ["findings"],
      correctOptionIds: ["debrief-additional-correct"],
      options: [
        option(
          "debrief-additional-correct",
          "פריט הציוד החסר אותר במחסן ולא הועבר לתחנה לפני הפתיחה.",
          "נכון",
          "ממצא עובדתי נוסף הרלוונטי להבנת הפער.",
          "",
        ),
        option(
          "debrief-additional-vague",
          "היו עוד כמה דברים קטנים.",
          "עמום",
          "",
          "ממצא צריך להיות מוגדר ולא אמירה כללית.",
        ),
        option(
          "debrief-additional-guess",
          "כנראה שמישהו פשוט שכח.",
          "השערה",
          "",
          "ממצא נשען על עובדה ולא על השערה.",
        ),
      ],
    }),
    section({
      id: "conclusions",
      title: "גורמים",
      purpose: "להסביר מדוע נוצר הפער — גורם ישיר וגורמים תורמים.",
      whatBelongs: "גורם ישיר וגורמים תורמים הנשענים על הממצאים.",
      commonMistakes: "מסקנה ללא ממצא או ניסוח של פעולה עתידית.",
      order: 9,
      prerequisiteIds: ["additional-findings"],
      correctOptionIds: ["debrief-conclusion-correct"],
      options: [
        option(
          "debrief-conclusion-correct",
          "גורם ישיר: אחריות בדיקת ציוד התחנות לא שובצה לבעל תפקיד. גורם תורם: לא בוצעה בדיקת מוכנות לפני הפתיחה.",
          "נכון",
          "הגורם מסביר את הסיבה לפער ונשען על הממצאים.",
          "",
        ),
        option(
          "debrief-conclusion-vague",
          "צריך להיות מסודרים יותר.",
          "לא מסקנה",
          "",
          "זהו ניסוח כללי שאינו מסביר מדוע נוצר הפער ואינו נשען על ממצא.",
        ),
        option(
          "debrief-conclusion-lesson",
          "בפעם הבאה אחראי הלוגיסטיקה יבדוק ציוד מראש.",
          "זהו לקח",
          "",
          "המשפט מגדיר פעולה עתידית. גורם צריך להסביר את הסיבה למה שקרה.",
          "lessons",
        ),
      ],
    }),
    section({
      id: "gaps",
      title: "תקלות ושגיאות",
      purpose: "להגדיר את התקלה ואת השגיאה שהובילו לפער.",
      whatBelongs: "תקלה ושגיאה מוגדרות בנפרד.",
      commonMistakes: "ערבוב התקלה עם הסיבה לה.",
      order: 10,
      prerequisiteIds: ["conclusions"],
      correctOptionIds: ["debrief-gap-correct"],
      options: [
        option(
          "debrief-gap-correct",
          "תקלה: תחנה ב׳ נפתחה באיחור של 15 דקות. שגיאה: לא הוגדר אחראי לבדיקת ציוד התחנות.",
          "נכון",
          "התקלה והשגיאה מוגדרות בנפרד ובמדויק.",
          "",
        ),
        option(
          "debrief-gap-reason",
          "התחנה התעכבה משום שאחריות בדיקת הציוד לא הוגדרה.",
          "כולל גורם",
          "",
          "המשפט מערבב את התקלה עם הסיבה. תחילה מגדירים את התקלה; הסיבה שייכת לגורמים.",
          "conclusions",
        ),
        option(
          "debrief-gap-vague",
          "היו כמה בעיות במהלך היום.",
          "עמום",
          "",
          "לא הוגדרו תקלה ושגיאה ברורות.",
        ),
      ],
    }),
    section({
      id: "noteworthy",
      title: "נק׳ ראויות לציון",
      purpose: "לציין נקודות חיוביות שראוי לשמר.",
      whatBelongs: "נקודה חיובית עובדתית הראויה לשימור.",
      commonMistakes: "ניסוח עמום או דילוג על נקודות לשימור.",
      order: 11,
      prerequisiteIds: ["gaps"],
      correctOptionIds: ["debrief-noteworthy-correct"],
      options: [
        option(
          "debrief-noteworthy-correct",
          "החוסר אותר ודווח מיד למפקד הפעילות, והפעילות חודשה בתוך 15 דקות.",
          "נכון",
          "נקודה חיובית עובדתית הראויה לשימור.",
          "",
        ),
        option(
          "debrief-noteworthy-vague",
          "בסך הכול הכול הסתדר.",
          "עמום",
          "",
          "נדרשת נקודה מוגדרת הניתנת לשימור.",
        ),
        option(
          "debrief-noteworthy-none",
          "אין שום דבר חיובי לציין.",
          "החמצה",
          "",
          "תחקיר מאוזן כולל גם נקודות לשימור, לא רק כשלים.",
        ),
      ],
    }),
    section({
      id: "lessons",
      title: "לקחים",
      purpose: "לקבוע מה לתקן, לחזק, לשנות או לשמר להבא.",
      whatBelongs: "פעולה ברורה, ישימה, קדימה ובתחום הסמכות.",
      commonMistakes: "לקח כללי, ללא אחראי או מועד, או פעולה שאינה בסמכות.",
      order: 12,
      prerequisiteIds: ["noteworthy"],
      correctOptionIds: ["debrief-lesson-correct"],
      options: [
        option(
          "debrief-lesson-correct",
          "לקח: בכל פק״א תוגדר בדיקת ציוד תחנות לבעל תפקיד, עד 30 דקות לפני פתיחת תחנות, בצירוף דיווח השלמה למפקד הפעילות.",
          "נכון",
          "זו פעולה קדימה, ישימה, עם אחראי ומועד, שנגזרת מן המסקנה.",
          "",
        ),
        option(
          "debrief-lesson-vague",
          "לא לאחר יותר.",
          "עמום",
          "",
          "לא הוגדר מה ישתנה, מי יבצע את השינוי ומתי.",
        ),
        option(
          "debrief-lesson-no-authority",
          "המתחקר ישנה את נוהל בדיקות הכשירות של כלל היחידה.",
          "אינו בסמכות",
          "",
          "אם הפעולה אינה בסמכות המתחקר, יש להעבירה כהמלצה לדרג המתאים.",
          "recommendations",
        ),
      ],
    }),
    section({
      id: "recommendations",
      title: "המלצות",
      purpose: "להעביר לדרג מתאים פעולות שאינן בסמכות המתחקר.",
      whatBelongs: "הצעה מנומקת לפעולה הנדרשת בסמכות גורם אחר.",
      commonMistakes: "הצגת ההמלצה כהוראה מחייבת שאין סמכות לבצע.",
      order: 13,
      prerequisiteIds: ["lessons"],
      correctOptionIds: ["debrief-recommendation-correct"],
      options: [
        option(
          "debrief-recommendation-correct",
          "להעביר לגורם האחראי על הרכב בקשה לעדכן את נוהל בדיקות הכשירות היחידתי.",
          "נכון",
          "הפעולה מועברת לדרג בעל הסמכות ואינה מוצגת כהוראה שהמתחקר יכול לבצע.",
          "",
        ),
        option(
          "debrief-recommendation-local",
          "אחראי הלוגיסטיקה יבדוק את ציוד התחנה עד 07:15.",
          "שייך ללקחים",
          "",
          "זו פעולה מקומית וישימה בתחום הסמכות ולכן מקומה כלקח.",
          "lessons",
        ),
        option(
          "debrief-recommendation-command",
          "יש לשנות לאלתר את כל נהלי הרכב ביחידה.",
          "חורג מסמכות",
          "",
          "הניסוח מציג הוראה מחייבת בלי להבהיר למי מועברת ההמלצה ומדוע.",
        ),
      ],
    }),
  ],
  reviewScenarios: [
    {
      id: "debrief-review-v1",
      title: "בקרת דוח התחקיר",
      instructions:
        "בדקו האם כל חלק נשען על עובדות, ממוקם במקום הנכון ומוביל ללקח ישים ובסמכות.",
      annotationBank: debriefAnnotations,
      scoringRules: defaultScoringRules,
      documentBlocks: [
        {
          id: "debrief-r-general-ok",
          sectionId: "general",
          label: "כללי",
          content:
            "כללי: בתאריך 15.7 התקיים יום אימון צוותי במתחם ההכשרות. התחקיר מתמקד בעיכוב פתיחת תחנה ב׳ ובחוסר בציוד.",
          expectedAnnotations: [],
          explanation:
            "החלק תקין: הוא מציג את מסגרת האירוע והמוקד ללא פרשנות.",
          isCorrect: true,
        },
        {
          id: "debrief-r-finding-blame",
          sectionId: "findings",
          label: "ממצא 1",
          content:
            "ממצא: אחראי התחנה היה לא מקצועי ולא התייחס ברצינות למשימה.",
          expectedAnnotations: [
            "debrief-interpretation",
            "debrief-no-evidence",
          ],
          explanation:
            "זוהי הערכת אופי והאשמה, לא עובדה שניתן לבסס באמצעות זמן, פעולה או תוצאה.",
          isCorrect: false,
        },
        {
          id: "debrief-r-finding-time",
          sectionId: "findings",
          label: "ממצא 2",
          content: "ממצא: בשלב כלשהו תחנה ב׳ נפתחה באיחור.",
          expectedAnnotations: ["debrief-no-evidence", "debrief-no-timeline"],
          explanation:
            "חסרים הזמן המתוכנן, הזמן בפועל ומיקום האירוע ברצף.",
          isCorrect: false,
        },
        {
          id: "debrief-r-gap-mixed",
          sectionId: "gaps",
          label: "תקלות ושגיאות",
          content:
            "תקלה: תחנה ב׳ התעכבה משום שאחראי הציוד לא ביצע בדיקה מוקדמת.",
          expectedAnnotations: ["debrief-no-gap"],
          explanation:
            "הניסוח מערבב סיבה (גורם) עם התקלה. תחילה יש להגדיר את התקלה — בכמה זמן התעכבה התחנה ביחס למצופה.",
          isCorrect: false,
        },
        {
          id: "debrief-r-conclusion",
          sectionId: "conclusions",
          label: "גורמים",
          content:
            "גורם: העיכוב נגרם משום שהצוערים לא הכירו את מתחם ההכשרות.",
          expectedAnnotations: ["debrief-unsupported-conclusion"],
          explanation:
            "אין בממצאים מידע שמבסס חוסר היכרות עם המתחם ולכן הגורם אינו נשען על עובדה קיימת.",
          isCorrect: false,
        },
        {
          id: "debrief-r-lesson-vague",
          sectionId: "lessons",
          label: "לקח 1",
          content: "לקח: בפעילות הבאה יש להיות מסודרים יותר ולא לאחר.",
          expectedAnnotations: ["debrief-not-actionable"],
          explanation:
            "הלקח אינו מגדיר פעולה, אחראי, מועד או דרך שמונעת את הישנות הפער.",
          isCorrect: false,
        },
        {
          id: "debrief-r-lesson-owner",
          sectionId: "lessons",
          label: "לקח 2",
          content: "לקח: יש לבדוק את כל הציוד לפני פתיחת התחנות.",
          expectedAnnotations: ["debrief-no-owner", "debrief-no-deadline"],
          explanation:
            "הפעולה נכונה בכיוון, אך אין בעל תפקיד ואין נקודת זמן שמאפשרת בקרה.",
          isCorrect: false,
        },
        {
          id: "debrief-r-authority",
          sectionId: "lessons",
          label: "לקח 3",
          content:
            "לקח: המתחקר ישנה את נוהל בדיקות הכשירות של כלל היחידה.",
          expectedAnnotations: ["debrief-no-authority"],
          explanation:
            "שינוי נוהל יחידתי אינו בסמכות המתחקר ולכן צריך להופיע כהמלצה לדרג המתאים.",
          isCorrect: false,
        },
        {
          id: "debrief-r-recommendation-ok",
          sectionId: "recommendations",
          label: "המלצה",
          content:
            "המלצה: להעביר לגורם האחראי על הרכב בקשה לעדכן את נוהל בדיקות הכשירות היחידתי.",
          expectedAnnotations: [],
          explanation:
            "החלק תקין: הפעולה שאינה בסמכות מועברת לדרג המתאים כהמלצה.",
          isCorrect: true,
        },
      ],
    },
  ],
  summaryPoints: [
    "תחקיר מתחיל בעובדות וברצף, לא בפרשנות או בחיפוש אשמים.",
    "ממצא מתאר מה קרה; מסקנה מסבירה מדוע; לקח קובע מה נעשה אחרת.",
    "לקח צריך להיות ישים ובסמכות. פעולה שאינה בסמכות עוברת כהמלצה.",
  ],
};

export const modules: ModuleContent[] = [paka, risk, debrief];

export const modulesById = Object.fromEntries(
  modules.map((module) => [module.id, module]),
) as Record<ModuleId, ModuleContent>;
