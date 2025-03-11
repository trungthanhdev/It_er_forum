export enum Roles{
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum UserStatus{
    ACTIVE = "Active",
    BANNED = "Banned",
    RESTRICTED = "Restricted",
}

export enum PostStatus{
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}



export enum ReportSubject{
    COMMENT = "Comment",
    USER = "User",
    POST = "Post"
}

export enum ReportTitle{
    PRETENDING_TO_BE_SOMEONE = "Pretending to be someone",
    FAKE_ACCOUNT = "Fake account",
    FAKE_NAME = "Fake name",
    HARASSMENT_OR_BULLYING = "Harassment or bullying",
    PROBLEM_INVOLVING_MINORS = "Problem involving someone under 18",
    SUICIDE_OR_SELF_HARM = "Suicide or self-harm",
    VIOLENT_HATEFUL_CONTENT = "Violent hateful or disturbing content",
    SELLING_RESTRICTED_ITEMS = "Selling or promoting restricted items",
    ADULT_CONTENT = "Adult content",
    SCAM_FRAUD_FALSE_INFO = "Scam fraud or false information",
    DONT_WANT_TO_SEE_THIS = "I don’t want to see this"
}

export enum TagName{
    STUDENT = 'Student',
    INTERN = 'Intern',
    WEB_DEVELOPER = 'Web developer',
    GAME_DEVELOPER = 'Game developer',
    MOBILE_DEVELOPER = 'Mobile developer',
    SHARING = 'Sharing',
    PROBLEM = 'I have a problem',
    PROBLEM_SOLVING = 'Problem solving',
    AMA = 'Ask me anything',
    RECRUITMENT = 'Recruitment',
    NEWS = 'News',
    PROGRAMMING_LANGUAGE = 'Programming language',
    FRAMEWORK = 'Framework',
    TECHNOLOGY = 'Technology',
    GAME = 'Game',
    WHAT_IF = 'What if?',
    QUIZ = 'Quiz',
}

export enum TagCategory{
    PURPOSE = 'Purpose',
    TOPIC = 'Topic',
    SUITABLE_FOR = 'Suitable for',
    ENTERTAINMENT = 'Entertainment',
}

