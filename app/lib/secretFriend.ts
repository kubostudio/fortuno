import { shuffleArray } from "./random";

export type SecretFriendAssignment = {
    giver: string;
    receiver: string;
};

export function createSecretFriendAssignments(
    participants: string[]
): SecretFriendAssignment[] {
    let receivers = shuffleArray(participants);

    while (receivers.some((receiver, index) => receiver === participants[index])) {
        receivers = shuffleArray(participants);
    }

    return participants.map((giver, index) => ({
        giver,
        receiver: receivers[index],
    }));
}