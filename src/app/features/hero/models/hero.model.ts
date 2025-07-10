// {
//     "nameLabel": "Anya Corazon",
//     "genderLabel": "female",
//     "citizenshipLabel": "United States of America",
//     "skillsLabel": "superhuman strength",
//     "occupationLabel": "student",
//     "memberOfLabel": "The Spider Society",
//     "creatorLabel": "Fiona Avery"
//   }

export type Gender = "male" | "female";

export interface Hero {
    nameLabel: string;
    genderLabel: Gender;
    citizenshipLabel: string;
    skillsLabel: string;
    occupationLabel: string;
    memberOfLabel:  string;
    creatorLabel: string;
}
export type HeroKey = keyof Hero;
