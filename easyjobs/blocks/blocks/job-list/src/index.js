/**
 * WordPress dependeincies
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import Edit from './components/edit';
import attributes from './components/attributes';
import metadata from '../block.json';

registerBlockType( metadata, {
    attributes,
    edit: Edit,
    save: () => null,
} );