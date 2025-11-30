import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Server, Smartphone, Globe, Layers, HardDrive } from 'lucide-react';
import clsx from 'clsx';

const BaseNode = ({ data, icon: Icon, colorClass, isSelected }) => {
    return (
        <div className={clsx(
            "px-4 py-3 shadow-lg rounded-xl border-2 bg-gray-900 min-w-[180px] transition-all duration-200",
            isSelected ? "border-blue-500 shadow-blue-500/20" : "border-gray-700 hover:border-gray-600",
            colorClass
        )}>
            <Handle type="target" position={Position.Top} className="!bg-gray-500 !w-3 !h-3" />

            <div className="flex items-center gap-3">
                <div className={clsx("p-2 rounded-lg bg-opacity-20", colorClass.replace('border-', 'bg-').replace('text-', 'text-'))}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-100">{data.label}</div>
                    <div className="text-xs text-gray-400">{data.tech}</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !w-3 !h-3" />
        </div>
    );
};

export const DatabaseNode = memo(({ data, selected }) => (
    <BaseNode data={data} icon={Database} colorClass="border-emerald-500/50 text-emerald-400" isSelected={selected} />
));

export const ServerNode = memo(({ data, selected }) => (
    <BaseNode data={data} icon={Server} colorClass="border-blue-500/50 text-blue-400" isSelected={selected} />
));

export const ClientNode = memo(({ data, selected }) => (
    <BaseNode data={data} icon={Smartphone} colorClass="border-purple-500/50 text-purple-400" isSelected={selected} />
));

export const LoadBalancerNode = memo(({ data, selected }) => (
    <BaseNode data={data} icon={Globe} colorClass="border-orange-500/50 text-orange-400" isSelected={selected} />
));

export const CacheNode = memo(({ data, selected }) => (
    <BaseNode data={data} icon={Layers} colorClass="border-yellow-500/50 text-yellow-400" isSelected={selected} />
));

export const nodeTypes = {
    databaseNode: DatabaseNode,
    serverNode: ServerNode,
    clientNode: ClientNode,
    loadBalancerNode: LoadBalancerNode,
    cacheNode: CacheNode,
};
