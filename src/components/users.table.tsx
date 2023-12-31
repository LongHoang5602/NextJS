import { useEffect, useState } from 'react';
// import '../styles/users.style.css';
import { PlusOutlined, SmileOutlined, FrownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, notification, Popconfirm, Pagination } from 'antd';
import CreateUserModal from './users.create.modal';
import { ColumnsType } from 'antd/es/table';
import UpdateUserModal from './users.update.modal';



interface IUser {
    _id: string,
    email: string,
    name: string,
    role: string
}
interface IDataUser {
    _id: string,
    name: string,
    email: string,
    age: string,
    gender: string,
    address: string,
    role: string
}

const UserTable = () => {
    const access_token = localStorage.getItem("access_token") as string


    const [listUsers, setListUsers] = useState([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUserUpdate, setIsDataUserUpdate] = useState<IDataUser | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 2,
        pages: 0,
        total: 0
    })
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        getData()
    }, [])

    const confirm = (_id: string, email: string) => {
        deleteUser(_id)
        openNotification(true, `Delete user ${email} success `)
        getData()
    };
    const columns: ColumnsType<IUser> = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: ((value, record) => {
                return (
                    <>
                        <div>{record.email}</div>
                    </>
                )
            })
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        }
        ,
        {
            title: 'Action',
            render: ((value, record) => {
                return (
                    <>
                        <Button icon={<EditOutlined />}
                            onClick={() => {
                                setIsDataUserUpdate(value)
                                setIsUpdateModalOpen(true)
                            }}
                        />
                        <Popconfirm
                            title="Delete the task"
                            description={`Are you sure to delete this user ${value.email}?`}
                            onConfirm={() => {
                                confirm(value._id, value.email)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </>
                )
            })
        }
    ];

    const getData = async () => {
        const res = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access_token}`
            }
        })
        const d = await res.json()

        setListUsers(d.data.result)
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        })
        console.log(d.data)
    }

    const deleteUser = async (_id: string) => {
        const res = await fetch(`http://localhost:8000/api/v1/users/${_id}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access_token}`
            }
        })
        getData()
    }

    const openNotification = (status: boolean, message: string, text?: string[]) => {
        const str = text?.join("\n")
        console.log(str)
        if (status) {
            api.open({
                message: message,
                icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            });
        } else {
            api.open({
                message: message,
                description: (
                    <>
                        {text?.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </>
                ),
                role: 'alert',
                icon: <FrownOutlined style={{ color: '#fa0707' }} />,
            });
        }

    };

    const handleOnChange = async (page: number, pageSize: number) => {
        const res = await fetch(`http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access_token}`
            }
        })
        const d = await res.json()

        setListUsers(d.data.result)
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        })
    }



    return (
        <>
            {contextHolder}
            <div style={{ display: 'flex' }}>
                <h1>Manage User</h1>
                <Button style={{ marginTop: '25px', right: '20px', position: "absolute" }}
                    onClick={() => setIsCreateModalOpen(true)}
                    icon={<PlusOutlined />}
                >
                    Add new user
                </Button>
            </div>
            <Table
                dataSource={listUsers}
                columns={columns}
                pagination={
                    {
                        pageSize: meta.pageSize,
                        current: meta.current,
                        total: meta.total,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        onChange: (page: number, pageSize: number) => handleOnChange(page, pageSize),
                        showSizeChanger: true
                    }
                }
            />
            <CreateUserModal
                access_token={access_token}
                openNotification={openNotification}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                getData={getData}
            />
            <UpdateUserModal
                access_token={access_token}
                openNotification={openNotification}
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                getData={getData}
                dataUser={dataUserUpdate}
            />

        </>
    )
}
export default UserTable