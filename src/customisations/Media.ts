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

import {RenderMode} from "./models/RenderMode";
import {MatrixClientPeg} from "../MatrixClientPeg";
import {IMediaEventContent, IPreparedMedia, prepEventContentAsMedia} from "./models/IMediaEventContent";

// Populate this class with the details of your customisations when copying it.

// Implementation note: The Media class must complete the contract as shown here, though
// the constructor can be whatever is relevant to your implementation. The mediaForX
// functions below create an instance of the Media class and are used throughout the
// project.

/**
 * A media object is a representation of a "source media" and an optional
 * "thumbnail media", derived from event contents or external sources.
 */
export class Media {
    // Per above, this constructor signature can be whatever is helpful for you.
    constructor(private prepared: IPreparedMedia) {
    }

    /**
     * The MXC URI of the source media.
     */
    public get srcMxc(): string {
        return this.prepared.mxc;
    }

    /**
     * The MXC URI of the thumbnail media, if a thumbnail is recorded. Null/undefined
     * otherwise.
     */
    public get thumbnailMxc(): string | undefined | null {
        return this.prepared.thumbnail?.mxc;
    }

    /**
     * Whether or not a thumbnail is recorded for this media.
     */
    public get hasThumbnail(): boolean {
        return !!this.thumbnailMxc;
    }

    /**
     * The HTTP URL for the source media.
     */
    public get srcHttp(): string {
        return MatrixClientPeg.get().mxcUrlToHttp(this.srcMxc);
    }

    /**
     * Gets the HTTP URL for the thumbnail media with the requested characteristics, if a thumbnail
     * is recorded for this media. Returns null/undefined otherwise.
     * @param {number} width The desired width of the thumbnail.
     * @param {number} height The desired height of the thumbnail.
     * @param {"scale"|"crop"} mode The desired thumbnailing mode. Defaults to scale.
     * @returns {string} The HTTP URL which points to the thumbnail.
     */
    public getThumbnailHttp(width: number, height: number, mode: 'scale' | 'crop' = "scale"): string | null | undefined {
        if (!this.hasThumbnail) return null;
        return MatrixClientPeg.get().mxcUrlToHttp(this.thumbnailMxc, width, height, mode);
    }

    /**
     * Gets the HTTP URL for a thumbnail of the source media with the requested characteristics.
     * @param {number} width The desired width of the thumbnail.
     * @param {number} height The desired height of the thumbnail.
     * @param {"scale"|"crop"} mode The desired thumbnailing mode. Defaults to scale.
     * @returns {string} The HTTP URL which points to the thumbnail.
     */
    public getThumbnailOfSourceHttp(width: number, height: number, mode: 'scale' | 'crop' = "scale"): string {
        return MatrixClientPeg.get().mxcUrlToHttp(this.srcMxc, width, height, mode);
    }

    /**
     * Downloads the source media.
     * @returns {Promise<Response>} Resolves to the server's response for chaining.
     */
    public downloadSource(): Promise<Response> {
        return fetch(this.srcHttp);
    }

    /**
     * Downloads the thumbnail media with the requested characteristics. If no thumbnail media is present,
     * this throws an exception.
     * @param {number} width The desired width of the thumbnail.
     * @param {number} height The desired height of the thumbnail.
     * @param {"scale"|"crop"} mode The desired thumbnailing mode. Defaults to scale.
     * @returns {Promise<Response>} Resolves to the server's response for chaining.
     */
    public downloadThumbnail(width: number, height: number, mode: 'scale' | 'crop' = "scale"): Promise<Response> {
        if (!this.hasThumbnail) throw new Error("Cannot download non-existent thumbnail");
        return fetch(this.getThumbnailHttp(width, height, mode));
    }

    /**
     * Downloads a thumbnail of the source media with the requested characteristics.
     * @param {number} width The desired width of the thumbnail.
     * @param {number} height The desired height of the thumbnail.
     * @param {"scale"|"crop"} mode The desired thumbnailing mode. Defaults to scale.
     * @returns {Promise<Response>} Resolves to the server's response for chaining.
     */
    public downloadThumbnailOfSource(width: number, height: number, mode: 'scale' | 'crop' = "scale"): Promise<Response> {
        return fetch(this.getThumbnailOfSourceHttp(width, height, mode));
    }

    /**
     * Gets the target render mode for the media. This might call external services, and will
     * be called often, and thus should be cached. Note that the render mode applies to the
     * whole media object, not just the source or thumbnail media.
     * @returns {Promise<RenderMode>} Resolves to the target render mode of the media.
     */
    public async getRenderMode(): Promise<RenderMode> {
        return RenderMode.Normal;
    }
}

/**
 * Creates a media object from event content.
 * @param {IMediaEventContent} content The event content.
 * @returns {Media} The media object.
 */
export function mediaFromContent(content: IMediaEventContent): Media {
    return new Media(prepEventContentAsMedia(content));
}

/**
 * Creates a media object from an MXC URI.
 * @param {string} mxc The MXC URI.
 * @returns {Media} The media object.
 */
export function mediaFromMxc(mxc: string): Media {
    return mediaFromContent({url: mxc});
}
