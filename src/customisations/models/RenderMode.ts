/*
 * Copyright 2021 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The various kinds of render modes which can apply to the media.
 */
export enum RenderMode {
    /**
     * The default render mode - the media presentation will not be altered.
     */
    Normal = "normal",

    /**
     * Blocked media will not be shown. A placeholder image might be used in
     * some cases where the media is important to the user experience (such as
     * in user avatars).
     */
    Blocked = "blocked",
}
