import { atom } from 'nanostores';

export const languageAtom = atom<string>('EN')
export const locationAtom = atom<string>('')

/* // Side Menu
export const isShowingSideMenuAtom = atom<boolean>(false)
export const showSideMenuAtom = atom<boolean>(false)
export const hideSideMenuAnimationAtom = atom<boolean>(false)
export const showProjectListAtom = atom<boolean>(false) */

// NavBarMobile
export const isShowingNavBarMenuAtom = atom<boolean>(false)
export const showNavBarMenuAtom = atom<boolean>(false)
export const hideNavBarMenuAtom = atom<boolean>(false)

// Color gallery
export const isColorGalleryAtom = atom<string>('')

// Side Menu
type MenuState = 'hidden' | 'hiding' | 'open' | 'opening';

export const stateSideMenuAtom = atom<MenuState>('hidden')
export const showProjectListAtom = atom<boolean>(false)