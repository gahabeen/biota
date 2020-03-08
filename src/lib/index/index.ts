import { indexes__by__terms } from './defaults/indexes__by__terms'

import * as ownerTemplates from './templates/owner'
import * as accessTemplates from './templates/access'
import * as activityTemplates from './templates/activity'
import * as assigneesTemplates from './templates/assignees'

export const defaults = { indexes__by__terms }
export const templates = { ...ownerTemplates, ...accessTemplates, ...activityTemplates, ...assigneesTemplates }

export * from './methods/cursor'
export * from './methods/index'
export * from './methods/reverse'
