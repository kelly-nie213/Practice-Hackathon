// Storage requires Firebase Blaze plan. All functions return '' gracefully if unavailable.

export async function uploadPhoto(_path: string, _uri: string): Promise<string> {
  return '';
}

export async function uploadUserProfilePhoto(_uid: string, _uri: string): Promise<string> {
  return '';
}

export async function uploadFamilyMemberPhoto(_uid: string, _memberId: string, _uri: string): Promise<string> {
  return '';
}
