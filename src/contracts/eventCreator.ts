import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Cell;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _new_owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadTupleTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type ProveOwnership = {
    $$type: 'ProveOwnership';
    query_id: bigint;
    dest: Address;
    forward_payload: Cell;
    with_content: boolean;
}

export function storeProveOwnership(src: ProveOwnership) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(81711432, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.dest);
        b_0.storeBuilder(src.forward_payload.asBuilder());
        b_0.storeBit(src.with_content);
    };
}

export function loadProveOwnership(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 81711432) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _dest = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    let _with_content = sc_0.loadBit();
    return { $$type: 'ProveOwnership' as const, query_id: _query_id, dest: _dest, forward_payload: _forward_payload, with_content: _with_content };
}

function loadTupleProveOwnership(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _dest = source.readAddress();
    let _forward_payload = source.readCell();
    let _with_content = source.readBoolean();
    return { $$type: 'ProveOwnership' as const, query_id: _query_id, dest: _dest, forward_payload: _forward_payload, with_content: _with_content };
}

function storeTupleProveOwnership(source: ProveOwnership) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.dest);
    builder.writeSlice(source.forward_payload);
    builder.writeBoolean(source.with_content);
    return builder.build();
}

function dictValueParserProveOwnership(): DictionaryValue<ProveOwnership> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeProveOwnership(src)).endCell());
        },
        parse: (src) => {
            return loadProveOwnership(src.loadRef().beginParse());
        }
    }
}

export type RequestOwner = {
    $$type: 'RequestOwner';
    query_id: bigint;
    dest: Address;
    forward_payload: Cell;
    with_content: boolean;
}

export function storeRequestOwner(src: RequestOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3502489578, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.dest);
        b_0.storeBuilder(src.forward_payload.asBuilder());
        b_0.storeBit(src.with_content);
    };
}

export function loadRequestOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3502489578) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _dest = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    let _with_content = sc_0.loadBit();
    return { $$type: 'RequestOwner' as const, query_id: _query_id, dest: _dest, forward_payload: _forward_payload, with_content: _with_content };
}

function loadTupleRequestOwner(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _dest = source.readAddress();
    let _forward_payload = source.readCell();
    let _with_content = source.readBoolean();
    return { $$type: 'RequestOwner' as const, query_id: _query_id, dest: _dest, forward_payload: _forward_payload, with_content: _with_content };
}

function storeTupleRequestOwner(source: RequestOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.dest);
    builder.writeSlice(source.forward_payload);
    builder.writeBoolean(source.with_content);
    return builder.build();
}

function dictValueParserRequestOwner(): DictionaryValue<RequestOwner> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeRequestOwner(src)).endCell());
        },
        parse: (src) => {
            return loadRequestOwner(src.loadRef().beginParse());
        }
    }
}

export type Destroy = {
    $$type: 'Destroy';
    query_id: bigint;
}

export function storeDestroy(src: Destroy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(520377210, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadDestroy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 520377210) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Destroy' as const, query_id: _query_id };
}

function loadTupleDestroy(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Destroy' as const, query_id: _query_id };
}

function storeTupleDestroy(source: Destroy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserDestroy(): DictionaryValue<Destroy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDestroy(src)).endCell());
        },
        parse: (src) => {
            return loadDestroy(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type Revoke = {
    $$type: 'Revoke';
    query_id: bigint;
}

export function storeRevoke(src: Revoke) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1871312355, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadRevoke(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1871312355) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Revoke' as const, query_id: _query_id };
}

function loadTupleRevoke(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Revoke' as const, query_id: _query_id };
}

function storeTupleRevoke(source: Revoke) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserRevoke(): DictionaryValue<Revoke> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeRevoke(src)).endCell());
        },
        parse: (src) => {
            return loadRevoke(src.loadRef().beginParse());
        }
    }
}

export type OwnershipProof = {
    $$type: 'OwnershipProof';
    query_id: bigint;
    item_id: bigint;
    owner: Address;
    data: Cell;
    revoked_at: bigint;
    content: Cell;
}

export function storeOwnershipProof(src: OwnershipProof) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(86296494, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.item_id, 257);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.data);
        b_0.storeInt(src.revoked_at, 257);
        b_0.storeRef(src.content);
    };
}

export function loadOwnershipProof(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 86296494) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _item_id = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _data = sc_0.loadRef();
    let _revoked_at = sc_0.loadIntBig(257);
    let _content = sc_0.loadRef();
    return { $$type: 'OwnershipProof' as const, query_id: _query_id, item_id: _item_id, owner: _owner, data: _data, revoked_at: _revoked_at, content: _content };
}

function loadTupleOwnershipProof(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _item_id = source.readBigNumber();
    let _owner = source.readAddress();
    let _data = source.readCell();
    let _revoked_at = source.readBigNumber();
    let _content = source.readCell();
    return { $$type: 'OwnershipProof' as const, query_id: _query_id, item_id: _item_id, owner: _owner, data: _data, revoked_at: _revoked_at, content: _content };
}

function storeTupleOwnershipProof(source: OwnershipProof) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.item_id);
    builder.writeAddress(source.owner);
    builder.writeCell(source.data);
    builder.writeNumber(source.revoked_at);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserOwnershipProof(): DictionaryValue<OwnershipProof> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeOwnershipProof(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipProof(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index_id: bigint;
    collection: Cell;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.index_id, 257);
        b_0.storeRef(src.collection);
    };
}

export function loadReportStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _index_id = sc_0.loadIntBig(257);
    let _collection = sc_0.loadRef();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function loadTupleReportStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index_id = source.readBigNumber();
    let _collection = source.readCell();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function storeTupleReportStaticData(source: ReportStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index_id);
    builder.writeSlice(source.collection);
    return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type OwnerInfo = {
    $$type: 'OwnerInfo';
    query_id: bigint;
    item_id: bigint;
    initiator: Address;
    owner: Address;
    data: Cell;
    revoked_at: bigint;
    content: Cell;
}

export function storeOwnerInfo(src: OwnerInfo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(232130531, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.item_id, 257);
        b_0.storeAddress(src.initiator);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.data);
        let b_1 = new Builder();
        b_1.storeInt(src.revoked_at, 257);
        b_1.storeRef(src.content);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadOwnerInfo(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 232130531) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _item_id = sc_0.loadIntBig(257);
    let _initiator = sc_0.loadAddress();
    let _owner = sc_0.loadAddress();
    let _data = sc_0.loadRef();
    let sc_1 = sc_0.loadRef().beginParse();
    let _revoked_at = sc_1.loadIntBig(257);
    let _content = sc_1.loadRef();
    return { $$type: 'OwnerInfo' as const, query_id: _query_id, item_id: _item_id, initiator: _initiator, owner: _owner, data: _data, revoked_at: _revoked_at, content: _content };
}

function loadTupleOwnerInfo(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _item_id = source.readBigNumber();
    let _initiator = source.readAddress();
    let _owner = source.readAddress();
    let _data = source.readCell();
    let _revoked_at = source.readBigNumber();
    let _content = source.readCell();
    return { $$type: 'OwnerInfo' as const, query_id: _query_id, item_id: _item_id, initiator: _initiator, owner: _owner, data: _data, revoked_at: _revoked_at, content: _content };
}

function storeTupleOwnerInfo(source: OwnerInfo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.item_id);
    builder.writeAddress(source.initiator);
    builder.writeAddress(source.owner);
    builder.writeCell(source.data);
    builder.writeNumber(source.revoked_at);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserOwnerInfo(): DictionaryValue<OwnerInfo> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeOwnerInfo(src)).endCell());
        },
        parse: (src) => {
            return loadOwnerInfo(src.loadRef().beginParse());
        }
    }
}

export type EventCreate = {
    $$type: 'EventCreate';
    query_id: bigint;
    content: Cell;
    ticket_price: bigint;
    total_options: bigint;
    stop_sell_ticket_datetime: bigint;
    event_start_datetime: bigint;
}

export function storeEventCreate(src: EventCreate) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(865600918, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeRef(src.content);
        b_0.storeCoins(src.ticket_price);
        b_0.storeUint(src.total_options, 8);
        b_0.storeInt(src.stop_sell_ticket_datetime, 257);
        b_0.storeInt(src.event_start_datetime, 257);
    };
}

export function loadEventCreate(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 865600918) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _content = sc_0.loadRef();
    let _ticket_price = sc_0.loadCoins();
    let _total_options = sc_0.loadUintBig(8);
    let _stop_sell_ticket_datetime = sc_0.loadIntBig(257);
    let _event_start_datetime = sc_0.loadIntBig(257);
    return { $$type: 'EventCreate' as const, query_id: _query_id, content: _content, ticket_price: _ticket_price, total_options: _total_options, stop_sell_ticket_datetime: _stop_sell_ticket_datetime, event_start_datetime: _event_start_datetime };
}

function loadTupleEventCreate(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _content = source.readCell();
    let _ticket_price = source.readBigNumber();
    let _total_options = source.readBigNumber();
    let _stop_sell_ticket_datetime = source.readBigNumber();
    let _event_start_datetime = source.readBigNumber();
    return { $$type: 'EventCreate' as const, query_id: _query_id, content: _content, ticket_price: _ticket_price, total_options: _total_options, stop_sell_ticket_datetime: _stop_sell_ticket_datetime, event_start_datetime: _event_start_datetime };
}

function storeTupleEventCreate(source: EventCreate) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeCell(source.content);
    builder.writeNumber(source.ticket_price);
    builder.writeNumber(source.total_options);
    builder.writeNumber(source.stop_sell_ticket_datetime);
    builder.writeNumber(source.event_start_datetime);
    return builder.build();
}

function dictValueParserEventCreate(): DictionaryValue<EventCreate> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeEventCreate(src)).endCell());
        },
        parse: (src) => {
            return loadEventCreate(src.loadRef().beginParse());
        }
    }
}

export type DeployEvent = {
    $$type: 'DeployEvent';
    query_id: bigint;
    owner: Address;
    content: Cell;
    event_start_datetime: bigint;
    stop_sell_ticket_datetime: bigint;
    ticket_price: bigint;
    total_options: bigint;
}

export function storeDeployEvent(src: DeployEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2206334150, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeInt(src.event_start_datetime, 257);
        b_0.storeInt(src.stop_sell_ticket_datetime, 257);
        b_0.storeCoins(src.ticket_price);
        b_0.storeUint(src.total_options, 8);
    };
}

export function loadDeployEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2206334150) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _event_start_datetime = sc_0.loadIntBig(257);
    let _stop_sell_ticket_datetime = sc_0.loadIntBig(257);
    let _ticket_price = sc_0.loadCoins();
    let _total_options = sc_0.loadUintBig(8);
    return { $$type: 'DeployEvent' as const, query_id: _query_id, owner: _owner, content: _content, event_start_datetime: _event_start_datetime, stop_sell_ticket_datetime: _stop_sell_ticket_datetime, ticket_price: _ticket_price, total_options: _total_options };
}

function loadTupleDeployEvent(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _event_start_datetime = source.readBigNumber();
    let _stop_sell_ticket_datetime = source.readBigNumber();
    let _ticket_price = source.readBigNumber();
    let _total_options = source.readBigNumber();
    return { $$type: 'DeployEvent' as const, query_id: _query_id, owner: _owner, content: _content, event_start_datetime: _event_start_datetime, stop_sell_ticket_datetime: _stop_sell_ticket_datetime, ticket_price: _ticket_price, total_options: _total_options };
}

function storeTupleDeployEvent(source: DeployEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeNumber(source.event_start_datetime);
    builder.writeNumber(source.stop_sell_ticket_datetime);
    builder.writeNumber(source.ticket_price);
    builder.writeNumber(source.total_options);
    return builder.build();
}

function dictValueParserDeployEvent(): DictionaryValue<DeployEvent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployEvent(src)).endCell());
        },
        parse: (src) => {
            return loadDeployEvent(src.loadRef().beginParse());
        }
    }
}

export type CreateTicket = {
    $$type: 'CreateTicket';
    query_id: bigint;
    ticket_amount: bigint;
    ticket_option: bigint;
}

export function storeCreateTicket(src: CreateTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2581647422, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.ticket_amount, 32);
        b_0.storeUint(src.ticket_option, 8);
    };
}

export function loadCreateTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2581647422) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _ticket_amount = sc_0.loadUintBig(32);
    let _ticket_option = sc_0.loadUintBig(8);
    return { $$type: 'CreateTicket' as const, query_id: _query_id, ticket_amount: _ticket_amount, ticket_option: _ticket_option };
}

function loadTupleCreateTicket(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _ticket_amount = source.readBigNumber();
    let _ticket_option = source.readBigNumber();
    return { $$type: 'CreateTicket' as const, query_id: _query_id, ticket_amount: _ticket_amount, ticket_option: _ticket_option };
}

function storeTupleCreateTicket(source: CreateTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.ticket_amount);
    builder.writeNumber(source.ticket_option);
    return builder.build();
}

function dictValueParserCreateTicket(): DictionaryValue<CreateTicket> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeCreateTicket(src)).endCell());
        },
        parse: (src) => {
            return loadCreateTicket(src.loadRef().beginParse());
        }
    }
}

export type DeployTicket = {
    $$type: 'DeployTicket';
    query_id: bigint;
    owner: Address;
}

export function storeDeployTicket(src: DeployTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2024684468, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.owner);
    };
}

export function loadDeployTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2024684468) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _owner = sc_0.loadAddress();
    return { $$type: 'DeployTicket' as const, query_id: _query_id, owner: _owner };
}

function loadTupleDeployTicket(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'DeployTicket' as const, query_id: _query_id, owner: _owner };
}

function storeTupleDeployTicket(source: DeployTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserDeployTicket(): DictionaryValue<DeployTicket> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployTicket(src)).endCell());
        },
        parse: (src) => {
            return loadDeployTicket(src.loadRef().beginParse());
        }
    }
}

export type AddOption = {
    $$type: 'AddOption';
    query_id: bigint;
}

export function storeAddOption(src: AddOption) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(890723957, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadAddOption(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 890723957) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'AddOption' as const, query_id: _query_id };
}

function loadTupleAddOption(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'AddOption' as const, query_id: _query_id };
}

function storeTupleAddOption(source: AddOption) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserAddOption(): DictionaryValue<AddOption> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAddOption(src)).endCell());
        },
        parse: (src) => {
            return loadAddOption(src.loadRef().beginParse());
        }
    }
}

export type CancelEvent = {
    $$type: 'CancelEvent';
    query_id: bigint;
}

export function storeCancelEvent(src: CancelEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2450588723, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadCancelEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2450588723) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'CancelEvent' as const, query_id: _query_id };
}

function loadTupleCancelEvent(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'CancelEvent' as const, query_id: _query_id };
}

function storeTupleCancelEvent(source: CancelEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserCancelEvent(): DictionaryValue<CancelEvent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeCancelEvent(src)).endCell());
        },
        parse: (src) => {
            return loadCancelEvent(src.loadRef().beginParse());
        }
    }
}

export type SetWinnerOption = {
    $$type: 'SetWinnerOption';
    query_id: bigint;
    winner_option: bigint;
}

export function storeSetWinnerOption(src: SetWinnerOption) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2892646381, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.winner_option, 8);
    };
}

export function loadSetWinnerOption(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2892646381) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _winner_option = sc_0.loadUintBig(8);
    return { $$type: 'SetWinnerOption' as const, query_id: _query_id, winner_option: _winner_option };
}

function loadTupleSetWinnerOption(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _winner_option = source.readBigNumber();
    return { $$type: 'SetWinnerOption' as const, query_id: _query_id, winner_option: _winner_option };
}

function storeTupleSetWinnerOption(source: SetWinnerOption) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.winner_option);
    return builder.build();
}

function dictValueParserSetWinnerOption(): DictionaryValue<SetWinnerOption> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSetWinnerOption(src)).endCell());
        },
        parse: (src) => {
            return loadSetWinnerOption(src.loadRef().beginParse());
        }
    }
}

export type ReturnTicket = {
    $$type: 'ReturnTicket';
    query_id: bigint;
}

export function storeReturnTicket(src: ReturnTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(289137714, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadReturnTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 289137714) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'ReturnTicket' as const, query_id: _query_id };
}

function loadTupleReturnTicket(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'ReturnTicket' as const, query_id: _query_id };
}

function storeTupleReturnTicket(source: ReturnTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserReturnTicket(): DictionaryValue<ReturnTicket> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeReturnTicket(src)).endCell());
        },
        parse: (src) => {
            return loadReturnTicket(src.loadRef().beginParse());
        }
    }
}

export type InternalReturnTicket = {
    $$type: 'InternalReturnTicket';
    query_id: bigint;
    index: bigint;
    ticket_amount: bigint;
    owner_address: Address;
    ticket_option: bigint;
}

export function storeInternalReturnTicket(src: InternalReturnTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3657645322, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.index, 64);
        b_0.storeUint(src.ticket_amount, 32);
        b_0.storeAddress(src.owner_address);
        b_0.storeUint(src.ticket_option, 8);
    };
}

export function loadInternalReturnTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3657645322) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _index = sc_0.loadUintBig(64);
    let _ticket_amount = sc_0.loadUintBig(32);
    let _owner_address = sc_0.loadAddress();
    let _ticket_option = sc_0.loadUintBig(8);
    return { $$type: 'InternalReturnTicket' as const, query_id: _query_id, index: _index, ticket_amount: _ticket_amount, owner_address: _owner_address, ticket_option: _ticket_option };
}

function loadTupleInternalReturnTicket(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index = source.readBigNumber();
    let _ticket_amount = source.readBigNumber();
    let _owner_address = source.readAddress();
    let _ticket_option = source.readBigNumber();
    return { $$type: 'InternalReturnTicket' as const, query_id: _query_id, index: _index, ticket_amount: _ticket_amount, owner_address: _owner_address, ticket_option: _ticket_option };
}

function storeTupleInternalReturnTicket(source: InternalReturnTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index);
    builder.writeNumber(source.ticket_amount);
    builder.writeAddress(source.owner_address);
    builder.writeNumber(source.ticket_option);
    return builder.build();
}

function dictValueParserInternalReturnTicket(): DictionaryValue<InternalReturnTicket> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeInternalReturnTicket(src)).endCell());
        },
        parse: (src) => {
            return loadInternalReturnTicket(src.loadRef().beginParse());
        }
    }
}

export type CancelTicket = {
    $$type: 'CancelTicket';
    query_id: bigint;
}

export function storeCancelTicket(src: CancelTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1316764559, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadCancelTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1316764559) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'CancelTicket' as const, query_id: _query_id };
}

function loadTupleCancelTicket(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'CancelTicket' as const, query_id: _query_id };
}

function storeTupleCancelTicket(source: CancelTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserCancelTicket(): DictionaryValue<CancelTicket> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeCancelTicket(src)).endCell());
        },
        parse: (src) => {
            return loadCancelTicket(src.loadRef().beginParse());
        }
    }
}

export type InternalCancelTicket = {
    $$type: 'InternalCancelTicket';
    query_id: bigint;
    index: bigint;
    ticket_amount: bigint;
    owner_address: Address;
    ticket_option: bigint;
}

export function storeInternalCancelTicket(src: InternalCancelTicket) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1002628343, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.index, 64);
        b_0.storeUint(src.ticket_amount, 32);
        b_0.storeAddress(src.owner_address);
        b_0.storeUint(src.ticket_option, 8);
    };
}

export function loadInternalCancelTicket(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1002628343) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _index = sc_0.loadUintBig(64);
    let _ticket_amount = sc_0.loadUintBig(32);
    let _owner_address = sc_0.loadAddress();
    let _ticket_option = sc_0.loadUintBig(8);
    return { $$type: 'InternalCancelTicket' as const, query_id: _query_id, index: _index, ticket_amount: _ticket_amount, owner_address: _owner_address, ticket_option: _ticket_option };
}

function loadTupleInternalCancelTicket(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index = source.readBigNumber();
    let _ticket_amount = source.readBigNumber();
    let _owner_address = source.readAddress();
    let _ticket_option = source.readBigNumber();
    return { $$type: 'InternalCancelTicket' as const, query_id: _query_id, index: _index, ticket_amount: _ticket_amount, owner_address: _owner_address, ticket_option: _ticket_option };
}

function storeTupleInternalCancelTicket(source: InternalCancelTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index);
    builder.writeNumber(source.ticket_amount);
    builder.writeAddress(source.owner_address);
    builder.writeNumber(source.ticket_option);
    return builder.build();
}

function dictValueParserInternalCancelTicket(): DictionaryValue<InternalCancelTicket> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeInternalCancelTicket(src)).endCell());
        },
        parse: (src) => {
            return loadInternalCancelTicket(src.loadRef().beginParse());
        }
    }
}

export type ReturnTicketSuccess = {
    $$type: 'ReturnTicketSuccess';
    query_id: bigint;
}

export function storeReturnTicketSuccess(src: ReturnTicketSuccess) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2284431226, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadReturnTicketSuccess(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2284431226) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'ReturnTicketSuccess' as const, query_id: _query_id };
}

function loadTupleReturnTicketSuccess(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'ReturnTicketSuccess' as const, query_id: _query_id };
}

function storeTupleReturnTicketSuccess(source: ReturnTicketSuccess) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserReturnTicketSuccess(): DictionaryValue<ReturnTicketSuccess> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeReturnTicketSuccess(src)).endCell());
        },
        parse: (src) => {
            return loadReturnTicketSuccess(src.loadRef().beginParse());
        }
    }
}

export type InternalClearEvent = {
    $$type: 'InternalClearEvent';
    query_id: bigint;
    god_address: Address;
}

export function storeInternalClearEvent(src: InternalClearEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2793430422, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.god_address);
    };
}

export function loadInternalClearEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2793430422) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _god_address = sc_0.loadAddress();
    return { $$type: 'InternalClearEvent' as const, query_id: _query_id, god_address: _god_address };
}

function loadTupleInternalClearEvent(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _god_address = source.readAddress();
    return { $$type: 'InternalClearEvent' as const, query_id: _query_id, god_address: _god_address };
}

function storeTupleInternalClearEvent(source: InternalClearEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.god_address);
    return builder.build();
}

function dictValueParserInternalClearEvent(): DictionaryValue<InternalClearEvent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeInternalClearEvent(src)).endCell());
        },
        parse: (src) => {
            return loadInternalClearEvent(src.loadRef().beginParse());
        }
    }
}

export type ClearEvent = {
    $$type: 'ClearEvent';
    query_id: bigint;
    event_address: Address;
}

export function storeClearEvent(src: ClearEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3007469561, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.event_address);
    };
}

export function loadClearEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3007469561) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _event_address = sc_0.loadAddress();
    return { $$type: 'ClearEvent' as const, query_id: _query_id, event_address: _event_address };
}

function loadTupleClearEvent(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _event_address = source.readAddress();
    return { $$type: 'ClearEvent' as const, query_id: _query_id, event_address: _event_address };
}

function storeTupleClearEvent(source: ClearEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.event_address);
    return builder.build();
}

function dictValueParserClearEvent(): DictionaryValue<ClearEvent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeClearEvent(src)).endCell());
        },
        parse: (src) => {
            return loadClearEvent(src.loadRef().beginParse());
        }
    }
}

export type EventData = {
    $$type: 'EventData';
    ticket_price: bigint;
    balance: bigint;
    owner_address: Address;
    event_creator_address: Address;
    index: bigint;
    content: Cell;
    total_tickets: bigint;
    total_options: bigint;
    is_completed: boolean;
    winner_option: bigint;
    share_per_ticket: bigint;
    options: Dictionary<bigint, bigint>;
    event_start_datetime: bigint;
    stop_sell_ticket_datetime: bigint;
}

export function storeEventData(src: EventData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.ticket_price, 257);
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner_address);
        let b_1 = new Builder();
        b_1.storeAddress(src.event_creator_address);
        b_1.storeInt(src.index, 257);
        b_1.storeRef(src.content);
        b_1.storeInt(src.total_tickets, 257);
        let b_2 = new Builder();
        b_2.storeInt(src.total_options, 257);
        b_2.storeBit(src.is_completed);
        b_2.storeInt(src.winner_option, 257);
        b_2.storeInt(src.share_per_ticket, 257);
        b_2.storeDict(src.options, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        let b_3 = new Builder();
        b_3.storeInt(src.event_start_datetime, 257);
        b_3.storeInt(src.stop_sell_ticket_datetime, 257);
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadEventData(slice: Slice) {
    let sc_0 = slice;
    let _ticket_price = sc_0.loadIntBig(257);
    let _balance = sc_0.loadIntBig(257);
    let _owner_address = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _event_creator_address = sc_1.loadAddress();
    let _index = sc_1.loadIntBig(257);
    let _content = sc_1.loadRef();
    let _total_tickets = sc_1.loadIntBig(257);
    let sc_2 = sc_1.loadRef().beginParse();
    let _total_options = sc_2.loadIntBig(257);
    let _is_completed = sc_2.loadBit();
    let _winner_option = sc_2.loadIntBig(257);
    let _share_per_ticket = sc_2.loadIntBig(257);
    let _options = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_2);
    let sc_3 = sc_2.loadRef().beginParse();
    let _event_start_datetime = sc_3.loadIntBig(257);
    let _stop_sell_ticket_datetime = sc_3.loadIntBig(257);
    return { $$type: 'EventData' as const, ticket_price: _ticket_price, balance: _balance, owner_address: _owner_address, event_creator_address: _event_creator_address, index: _index, content: _content, total_tickets: _total_tickets, total_options: _total_options, is_completed: _is_completed, winner_option: _winner_option, share_per_ticket: _share_per_ticket, options: _options, event_start_datetime: _event_start_datetime, stop_sell_ticket_datetime: _stop_sell_ticket_datetime };
}

function loadTupleEventData(source: TupleReader) {
    let _ticket_price = source.readBigNumber();
    let _balance = source.readBigNumber();
    let _owner_address = source.readAddress();
    let _event_creator_address = source.readAddress();
    let _index = source.readBigNumber();
    let _content = source.readCell();
    let _total_tickets = source.readBigNumber();
    let _total_options = source.readBigNumber();
    let _is_completed = source.readBoolean();
    let _winner_option = source.readBigNumber();
    let _share_per_ticket = source.readBigNumber();
    let _options = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _event_start_datetime = source.readBigNumber();
    let _stop_sell_ticket_datetime = source.readBigNumber();
    return { $$type: 'EventData' as const, ticket_price: _ticket_price, balance: _balance, owner_address: _owner_address, event_creator_address: _event_creator_address, index: _index, content: _content, total_tickets: _total_tickets, total_options: _total_options, is_completed: _is_completed, winner_option: _winner_option, share_per_ticket: _share_per_ticket, options: _options, event_start_datetime: _event_start_datetime, stop_sell_ticket_datetime: _stop_sell_ticket_datetime };
}

function storeTupleEventData(source: EventData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.ticket_price);
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner_address);
    builder.writeAddress(source.event_creator_address);
    builder.writeNumber(source.index);
    builder.writeCell(source.content);
    builder.writeNumber(source.total_tickets);
    builder.writeNumber(source.total_options);
    builder.writeBoolean(source.is_completed);
    builder.writeNumber(source.winner_option);
    builder.writeNumber(source.share_per_ticket);
    builder.writeCell(source.options.size > 0 ? beginCell().storeDictDirect(source.options, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.event_start_datetime);
    builder.writeNumber(source.stop_sell_ticket_datetime);
    return builder.build();
}

function dictValueParserEventData(): DictionaryValue<EventData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeEventData(src)).endCell());
        },
        parse: (src) => {
            return loadEventData(src.loadRef().beginParse());
        }
    }
}

export type EventCreatorData = {
    $$type: 'EventCreatorData';
    balance: bigint;
    event_index: bigint;
}

export function storeEventCreatorData(src: EventCreatorData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.balance, 257);
        b_0.storeInt(src.event_index, 257);
    };
}

export function loadEventCreatorData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadIntBig(257);
    let _event_index = sc_0.loadIntBig(257);
    return { $$type: 'EventCreatorData' as const, balance: _balance, event_index: _event_index };
}

function loadTupleEventCreatorData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _event_index = source.readBigNumber();
    return { $$type: 'EventCreatorData' as const, balance: _balance, event_index: _event_index };
}

function storeTupleEventCreatorData(source: EventCreatorData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeNumber(source.event_index);
    return builder.build();
}

function dictValueParserEventCreatorData(): DictionaryValue<EventCreatorData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeEventCreatorData(src)).endCell());
        },
        parse: (src) => {
            return loadEventCreatorData(src.loadRef().beginParse());
        }
    }
}

export type TicketData = {
    $$type: 'TicketData';
    owner_address: Address;
    event_address: Address;
    ticket_amount: bigint;
    ticket_option: bigint;
    returned: boolean;
}

export function storeTicketData(src: TicketData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner_address);
        b_0.storeAddress(src.event_address);
        b_0.storeInt(src.ticket_amount, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.ticket_option, 257);
        b_1.storeBit(src.returned);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTicketData(slice: Slice) {
    let sc_0 = slice;
    let _owner_address = sc_0.loadAddress();
    let _event_address = sc_0.loadAddress();
    let _ticket_amount = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _ticket_option = sc_1.loadIntBig(257);
    let _returned = sc_1.loadBit();
    return { $$type: 'TicketData' as const, owner_address: _owner_address, event_address: _event_address, ticket_amount: _ticket_amount, ticket_option: _ticket_option, returned: _returned };
}

function loadTupleTicketData(source: TupleReader) {
    let _owner_address = source.readAddress();
    let _event_address = source.readAddress();
    let _ticket_amount = source.readBigNumber();
    let _ticket_option = source.readBigNumber();
    let _returned = source.readBoolean();
    return { $$type: 'TicketData' as const, owner_address: _owner_address, event_address: _event_address, ticket_amount: _ticket_amount, ticket_option: _ticket_option, returned: _returned };
}

function storeTupleTicketData(source: TicketData) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner_address);
    builder.writeAddress(source.event_address);
    builder.writeNumber(source.ticket_amount);
    builder.writeNumber(source.ticket_option);
    builder.writeBoolean(source.returned);
    return builder.build();
}

function dictValueParserTicketData(): DictionaryValue<TicketData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTicketData(src)).endCell());
        },
        parse: (src) => {
            return loadTicketData(src.loadRef().beginParse());
        }
    }
}

type EventCreator_init_args = {
    $$type: 'EventCreator_init_args';
    god: Address;
}

function initEventCreator_init_args(src: EventCreator_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.god);
    };
}

async function EventCreator_init(god: Address) {
    const __code = Cell.fromBase64('te6ccgECHAEABYoAART/APSkE/S88sgLAQIBYgIDAtTQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxa2zzy4ILI+EMBzH8BygBZWSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFss/ye1UFAQCASAPEARw7aLt+wGSMH/gcCHXScIflTAg1wsf3iCCEDOYBZa6jwUw2zxsFuAgghCzQlf5uuMCIIIQlGqYtroFBgcIAEDTHwGCEDOYBZa68uCB0z/U+gDTB4EBAdcAgQEB1wBVUAP2gRK4I8Ez8vRTAbzy5P/4Q/goKNs8XHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcIBAcPhCEGwFEEsQN0ipyFVg2zzJQBRQUxYQNhA1EDTbPKR/FwkNAfww0x8BghCzQlf5uvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBJsEoEeDvhCUlDHBfL0cHCAQlFGyFmCEKaAXZZQA8sfyz8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyRA0QTAQJBAjbW3bPH8NAmSOqDDTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gwACRMOMNcAoLAHyCEIOB/MZQCMsfFss/UAQg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYSzIEBAc8AgQEBzwAB+gLLBwE6bW0ibrOZWyBu8tCAbyIBkTLiECRwAwSAQlAj2zwNApz5AYLwfayqK1O9QGl/vIiOJJp1KL3c3KeVypI9b7q7W9pkJkq6jyaBHg74QlIwxwXy9PgnbxCCCcnDgKFwcoglVTAQJBAjbW3bPH/bMeAMDQAcAAAAAFdpdGhkcmF3YWwByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsADgCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzAIBIBESAgEgGBkCEbtInbPNs8bCKBQTAhO4Yq2zxY2zxsIYFBUACvgnbxAhAcDtRNDUAfhj0gABjiX6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdM/WWwS4Pgo1wsKgwm68uCJ+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHR2zwWAZD4Q/goWNs8cFnIcAHLAXMBywFwAcsAEszMyfkAyHIBywFwAcsAEsoHy//J0CDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgXAAJwANYC0PQEMG0hgTF+AYAQ9A9vofLghwGBMX4iAoAQ9BcCggCkzQGAEPQPb6Hy4IcSggCkzQECgBD0F8gByPQAyQHMcAHKAEADWSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFoEBAc8AyQC5u70YJwXOw9XSyuex6E7DnWSoUbZoJwndY1LStkfLMi068t/fFiOYJwIFXAG4BnY5TOWDquRyWyw4JwG9Sd75VFlvHHU9PeBVnDJoJwnZdOWrNOy3M6DpZtlGbopIAgFIGhsAEbCvu1E0NIAAYAB1sm7jQ1aXBmczovL1FtUXZ3cVdSWTI3cDEzR1JZUTR2M3J1NHFUR0ttTENlMk1UNjRLS01OeDJkeDGCA=');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initEventCreator_init_args({ $$type: 'EventCreator_init_args', god })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const EventCreator_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    1279: { message: `Invalid event config` },
    3211: { message: `Invalid option` },
    4792: { message: `More than 50 options` },
    5511: { message: `Invalid ticket` },
    7073: { message: `Event is completed` },
    7694: { message: `God required` },
    10162: { message: `Event closed` },
    21498: { message: `Now > stop sell ticket datetime` },
    22136: { message: `Owner required` },
    29266: { message: `Its too early to cancel tickets` },
    29697: { message: `Ticket already canceled` },
    34577: { message: `Ticket already returned` },
    35031: { message: `Event not closed` },
    45052: { message: `Onwer required` },
    49280: { message: `not owner` },
    49427: { message: `Not enough ton for buy tickets` },
    52392: { message: `Too late to set winner option` },
    58992: { message: `Event is not over yet` },
}

const EventCreator_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"ProveOwnership","header":81711432,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"dest","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}},{"name":"with_content","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"RequestOwner","header":3502489578,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"dest","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}},{"name":"with_content","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Destroy","header":520377210,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"Revoke","header":1871312355,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"OwnershipProof","header":86296494,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"item_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}},{"name":"revoked_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"OwnerInfo","header":232130531,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"item_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"initiator","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}},{"name":"revoked_at","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"EventCreate","header":865600918,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"ticket_price","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"total_options","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"stop_sell_ticket_datetime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"event_start_datetime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"DeployEvent","header":2206334150,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"event_start_datetime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"stop_sell_ticket_datetime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ticket_price","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"total_options","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"CreateTicket","header":2581647422,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"ticket_amount","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"ticket_option","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"DeployTicket","header":2024684468,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AddOption","header":890723957,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CancelEvent","header":2450588723,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SetWinnerOption","header":2892646381,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"winner_option","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"ReturnTicket","header":289137714,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"InternalReturnTicket","header":3657645322,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"ticket_amount","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"ticket_option","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"CancelTicket","header":1316764559,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"InternalCancelTicket","header":1002628343,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"ticket_amount","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"ticket_option","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"ReturnTicketSuccess","header":2284431226,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"InternalClearEvent","header":2793430422,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"god_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ClearEvent","header":3007469561,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"event_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"EventData","header":null,"fields":[{"name":"ticket_price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"event_creator_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"total_tickets","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"total_options","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_completed","type":{"kind":"simple","type":"bool","optional":false}},{"name":"winner_option","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"share_per_ticket","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"options","type":{"kind":"dict","key":"int","value":"int"}},{"name":"event_start_datetime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"stop_sell_ticket_datetime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventCreatorData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"event_index","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"TicketData","header":null,"fields":[{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"event_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"ticket_amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ticket_option","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"returned","type":{"kind":"simple","type":"bool","optional":false}}]},
]

const EventCreator_getters: ABIGetter[] = [
    {"name":"get_data","arguments":[],"returnType":{"kind":"simple","type":"EventCreatorData","optional":false}},
    {"name":"get_event_address","arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":false}},
]

const EventCreator_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"EventCreate"}},
    {"receiver":"internal","message":{"kind":"text","text":"withdrawal"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClearEvent"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class EventCreator implements Contract {

    static async init(god: Address) {
        return await EventCreator_init(god);
    }

    static async fromInit(god: Address) {
        const init = await EventCreator_init(god);
        const address = contractAddress(0, init);
        return new EventCreator(address, init);
    }

    static fromAddress(address: Address) {
        return new EventCreator(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  EventCreator_types,
        getters: EventCreator_getters,
        receivers: EventCreator_receivers,
        errors: EventCreator_errors,
    };

    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: EventCreate | 'withdrawal' | ClearEvent | Deploy) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'EventCreate') {
            body = beginCell().store(storeEventCreate(message)).endCell();
        }
        if (message === 'withdrawal') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClearEvent') {
            body = beginCell().store(storeClearEvent(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.internal(via, { ...args, body: body });

    }

    async getGetData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_data', builder.build())).stack;
        const result = loadTupleEventCreatorData(source);
        return result;
    }

    async getGetEventAddress(provider: ContractProvider, index: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(index);
        let source = (await provider.get('get_event_address', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }

}