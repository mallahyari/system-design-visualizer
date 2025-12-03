import {
  CacheNode,
  ClientNode,
  DatabaseNode,
  LoadBalancerNode,
  ServerNode,
} from "../components/CustomNodes";

export const nodeTypes = {
  databaseNode: DatabaseNode,
  serverNode: ServerNode,
  clientNode: ClientNode,
  loadBalancerNode: LoadBalancerNode,
  cacheNode: CacheNode,
};
