import { ResourceType } from '../../shared/resource-type';

/**
 * The resource type for LdapInfo
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */

export const LDAP_INFO = new ResourceType('ldap-info');
